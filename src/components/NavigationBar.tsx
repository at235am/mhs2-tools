// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { createElement, ReactElement, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";

// icons:
import { CgMenu } from "react-icons/cg";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { MdClose } from "react-icons/md";

// custom components:
import Debug from "./Debug";

// custom hooks:
import { useThemeState } from "../contexts/ThemeContext";
import { useUIState } from "../contexts/UIContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { GUTTER } from "./Gutter";
import { useAuth } from "../contexts/AuthContext";

// background: ${({ theme }) =>
//   `linear-gradient(45deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`};
const NavbarContainer = styled(motion.nav)`
  z-index: 3;

  position: sticky;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${({ theme }) => css`
    height: ${theme.dimensions.mainNav.maxHeight}px;
    max-height: ${theme.dimensions.mainNav.maxHeight}px;
    min-height: ${theme.dimensions.mainNav.maxHeight}px;
  `}

  width: 100%;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
`;

const MainNav = styled(motion.ul)`
  ${GUTTER}

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  gap: 1rem;

  /*
    &::after here represents the background for this container.
    This is done so that we can have an opacity on the background without affecting the opacity
    of children elements (like text, icons, buttons, etc).
   */
  &::after {
    z-index: 5;

    position: absolute;
    top: 0;
    left: 0;

    content: "";

    width: 100%;
    height: 100%;

    background-color: ${({ theme }) => rgba(theme.colors.surface.main, 0.97)};
    backdrop-filter: blur(2px);
  }
`;

const LogoLI = styled.li`
  z-index: 10;
  position: relative;

  flex: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    order: 2; // puts logo in the middle (there are only 3 items)
  }
`;

const MenuButtonLI = styled.li`
  z-index: 10;
  position: relative;

  order: 1;
  flex: 1;

  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ThemeButtonLI = styled.li`
  z-index: 10;
  position: relative;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  order: 3;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    order: 3;

    flex: 1;
  }
`;

const LinkNavLI = styled(motion.li)`
  z-index: 10;

  position: relative;
  /* border: 2px dashed red; */

  background-color: transparent;

  flex: 1;

  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    z-index: 0; // move LinkNavLI BELOW background (::after element on MainNav)

    flex-direction: column;
    gap: 0;

    width: 100%;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);

    position: absolute;
    top: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px;
    left: 0;

    padding-bottom: 1rem;

    /*
    &::after here represents the background for this container.
    This is done so that we can have an opacity on the background without affecting the opacity
    of children elements (like text, icons, buttons, etc).
   */
    &::after {
      z-index: -1;

      position: absolute;
      top: 0;
      left: 0;

      content: "";

      width: 100%;
      height: 100%;

      background-color: ${({ theme }) => rgba(theme.colors.surface.main, 0.97)};
      backdrop-filter: blur(2px);
    }
  }
`;

const ListContainer = styled.ul`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    gap: 0;

    width: 100%;

    height: min-content;
    background-color: inherit;
  }
`;

const NavItemContainer = styled(motion.li)`
  position: relative;
  cursor: pointer;

  height: 3rem;

  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    a {
      p {
        /* text-decoration: underline; */
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    width: 100%;
    padding: 0 2rem;

    &:hover {
      background-color: ${({ theme }) => theme.colors.surface.dark};
    }
  }
`;

const MotionLink = styled(motion(Link))`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    svg {
      height: 100%;
      width: 100%;

      path,
      line {
        fill: ${({ theme }) => theme.colors.onSurface.main};
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    align-items: flex-start;
  }
`;

const P = styled(motion.p)`
  white-space: nowrap;
  font-size: 0.85rem;
  font-weight: 600;

  /* font-style: italic; */
`;

const Marker = styled(motion.div)`
  position: absolute;
  bottom: 8px;

  width: 100%;
  height: 3px;
  border-radius: 3px;

  background-color: ${({ theme }) => theme.colors.primary.main};

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    top: 41%;
    left: -1rem;

    width: 7px;
    height: 7px;
    border-radius: 50%;
  }
`;

type NewNavItemProps = {
  to: string;
  text?: string;
  icon?: IconType;
  iconSize?: number;
  small?: boolean;
  className?: string;
  onClick?: () => void;
  iconAnimationProps?: object;
  showMarker?: boolean;
  children?: ReactElement;
};

const NavLink = ({
  to = "#",
  text,
  icon,
  small = false,
  iconSize = 20,
  className,
  iconAnimationProps,
  showMarker = true,
  onClick = () => {},
  children,
}: NewNavItemProps) => {
  // const Container = small ? NavItemContainerSmall : NavItemContainer;
  // const Inner = to === "#" ? NavButton : NavLink;
  const location = useLocation();
  const selected = location.pathname.includes(to);

  return (
    <NavItemContainer className={className}>
      <MotionLink to={to} onClick={onClick}>
        {selected && <Marker layoutId="link-marker" />}
        {icon && (
          <motion.span {...iconAnimationProps}>
            {createElement(icon)}
          </motion.span>
        )}
        {text && <P>{text}</P>}
      </MotionLink>
    </NavItemContainer>
  );
};

const MenuButton = styled.button`
  width: 3rem;
  height: 3rem;

  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.background.main};

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    path {
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};

    svg {
      path {
        fill: ${({ theme }) => theme.colors.onPrimary.main};
        stroke: ${({ theme }) => theme.colors.onPrimary.main};
      }
    }
  }
`;

const NavigationBar = () => {
  const { user } = useAuth();

  const { isMobile } = useUIState();
  const [mainNav, setMainNav] = useState(false);
  const { selectedTheme, toggleTheme } = useThemeState();
  const themeToggle = selectedTheme === "dark" ? true : false;
  const showMainNav = mainNav ? true : !isMobile;

  const mainNavAnimationProps = {
    variants: {
      open: { y: 0 },
      closed: {
        y: -450,
      },
    },
    initial: "closed",
    animate: showMainNav ? "open" : "closed",
    exit: "closed",
    transition: { duration: 0.25 },
    // transition: { velocity: 500 },
  };

  const toggleMainNav = () => setMainNav((val) => !val);

  const closeSidebarToggleMainNav = () => {
    // setSidebarState(false);
    toggleMainNav();
  };

  const closeMainNavToggleSidebar = () => {
    setMainNav(false);
    // toggleSidebar();
  };

  const closeMainNav = () => setMainNav(false);

  return (
    <NavbarContainer>
      <MainNav>
        {/* ITEM 1 (LOGO) */}
        <LogoLI>
          <Logo />
        </LogoLI>

        {/* ITEM 2 (ACTUAL NAV ITEMS) */}
        <AnimateSharedLayout>
          <AnimatePresence>
            {showMainNav && (
              <LinkNavLI {...mainNavAnimationProps}>
                <ListContainer>
                  <NavLink
                    text="Monsties"
                    // icon={GiBrute}
                    to="/monsties"
                    iconSize={18}
                    onClick={closeMainNav}
                    // iconAnimation={crossHairAnimationProps}
                  />
                  <NavLink
                    text="Genes"
                    // icon={BiDna}
                    to="/genes"
                    iconSize={18}
                    onClick={closeMainNav}
                  />
                  <NavLink
                    text="Team Builder"
                    // icon={MdBuild}
                    to="/builds"
                    iconSize={18}
                    onClick={closeMainNav}
                  />
                </ListContainer>{" "}
                <ListContainer>
                  <NavLink
                    text="Account"
                    // icon={MdBuild}
                    to="/account"
                    // iconSize={18}
                    onClick={closeMainNav}
                  />
                  <NavLink
                    text="Contribute"
                    // icon={MdBuild}
                    to="/contribute"
                    // iconSize={18}
                    onClick={closeMainNav}
                  />

                  {/* <NavItem> */}

                  {/* </NavItem> */}
                </ListContainer>
              </LinkNavLI>
            )}
          </AnimatePresence>
        </AnimateSharedLayout>

        {/* ITEM 3 (Theme Button) */}
        <ThemeButtonLI>
          <ThemeToggle />
        </ThemeButtonLI>

        {/* ITEM 4 (Menu button for mobile mode) */}
        {isMobile && (
          <MenuButtonLI>
            <MenuButton type="button" onClick={closeSidebarToggleMainNav}>
              {mainNav ? <MdClose /> : <HiOutlineMenuAlt4 />}
            </MenuButton>
          </MenuButtonLI>
        )}
      </MainNav>
    </NavbarContainer>
  );
};
export default NavigationBar;
