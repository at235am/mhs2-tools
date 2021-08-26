import { Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";
import { motion, AnimatePresence } from "framer-motion";
import { MouseEventHandler, useEffect, useRef, useState } from "react";

import { BiSearch } from "react-icons/bi";
import { RiQuestionFill } from "react-icons/ri";
import RefModal from "./RefModal";

const ICON_SIZE = 24;

type SBProps = {
  showAlert: boolean;
};

// border: 1px solid ${({ showAlert, theme }) =>
//   showAlert ? theme.colors.primary.main : theme.colors.onSurface.main}};
const SBContainer = styled(motion.div)<SBProps>`
  position: relative;

  z-index: 100;
  width: 100%;
  height: 4rem;
  min-height: 4rem;
  max-height: 4rem;

  box-shadow: 0px 0px 20px -13px black;

  /* position: sticky; */
  /* top: 0; */
  /* left: 0; */

  overflow: hidden;

  /* opacity: 0.94; */
  /* backdrop-filter: blur(2px); */

  border-radius: 5rem;

  /* background-color: ${({ theme }) => theme.colors.surface.main}; */

  background-color: transparent;

  /* border: 1px solid
    ${({ showAlert, theme }) =>
    showAlert ? theme.colors.primary.main : theme.colors.surface.main}; */

  /* box-shadow: 0px 0px 0px 1px ${({ theme }) =>
    theme.colors.onSurface.main}; */
  padding: 0 1.5rem;

  display: flex;
  align-items: center;

  /* outline-offset: -5px; */

  span {
    /* background-color: red; */
    margin-right: 0.5rem;
    width: ${ICON_SIZE}px;
    min-width: ${ICON_SIZE}px;
    max-width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    min-height: ${ICON_SIZE}px;
    max-height: ${ICON_SIZE}px;
    svg {
      width: 100%;
      height: 100%;
      path {
        fill: ${({ theme }) => theme.colors.onSurface.main};
      }
    }
  }

  &:hover {
    span {
      svg {
        path {
          fill: ${({ theme }) => theme.colors.primary.main};
        }
      }
    }
  }

  p {
    color: ${({ theme }) => theme.colors.danger.main};
    white-space: nowrap;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;

  /* border: 1px solid red; */

  background-color: transparent;
  caret-color: ${({ theme }) => theme.colors.primary.main};

  color: ${({ theme }) => theme.colors.onSurface.main};

  &::placeholder {
    color: ${({ theme }) => theme.colors.onSurface.main};
  }

  &[type="search"]::-ms-clear {
    display: none;
    width: 0;
    height: 0;
  }
  &[type="search"]::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
  }

  &[type="search"]::-webkit-search-decoration,
  &[type="search"]::-webkit-search-cancel-button,
  &[type="search"]::-webkit-search-results-button,
  &[type="search"]::-webkit-search-results-decoration {
    display: none;
  }
`;

const CFContainer = styled.div`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.onSurface.main};
  white-space: nowrap;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const BTN_SIZE = 22;

const WhyButton = styled.button`
  cursor: pointer;
  width: ${BTN_SIZE}px;
  min-width: ${BTN_SIZE}px;
  max-width: ${BTN_SIZE}px;
  height: ${BTN_SIZE}px;
  min-height: ${BTN_SIZE}px;
  max-height: ${BTN_SIZE}px;

  border-radius: 50%;

  margin-left: 0.5rem;
  background-color: transparent;

  svg {
    width: 100%;
    height: 100%;
    g {
      path:nth-of-type(2) {
        fill: ${({ theme }) => theme.colors.surface.main};
      }
    }
  }

  &:hover {
    /* background-color: transparent; */
    svg {
      width: 100%;
      height: 100%;
      g {
        path:nth-of-type(2) {
          fill: ${({ theme }) => theme.colors.primary.main};
        }
      }
    }
  }
`;

const SearchNotice = styled.div`
  /* background-color: red; */

  width: 18rem;
  /* height: 20rem; */
  display: flex;
  flex-direction: column;
  margin-top: 2px;
  margin-right: 10px;

  ::before {
    content: "";
    width: 20px;
    height: 15px;
    background-color: black;
    align-self: flex-end;
    clip-path: polygon(7% 100%, 100% 100%, 100% 0);

    background-color: ${({ theme }) => theme.colors.surface.main};
    transform: translateY(3px);
  }

  p {
    border-radius: 3px;
    background-color: ${({ theme }) => theme.colors.surface.main};
    color: ${({ theme }) => theme.colors.onSurface.main};
    padding: 1rem;
  }
`;

const CtrlFAlert = () => {
  const [tooltip, setTooltip] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const test = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setTooltip((v) => !v);
  };

  return (
    <CFContainer>
      {tooltip && (
        <RefModal
          // text="Hello there"
          stickToRef={buttonRef}
          stickToPin="bottom-right"
          tooltipPin="top-right"
          // marginTop={5}
          // marginRight={5}
        >
          <SearchNotice>
            <p>
              Our table is virtualized for performance reasons, meaning we only
              render the rows of the table that can fit within your screen,
              therefore <code>CTRL + F</code> will not work as intended.
            </p>
          </SearchNotice>
        </RefModal>
      )}
      Try using our search instead!
      <WhyButton onClick={test} ref={buttonRef}>
        <RiQuestionFill />
      </WhyButton>
    </CFContainer>
  );
};

export interface SearchBarProps {
  value: string | number | readonly string[] | undefined;
  onChange: any;
  placeholderText?: string;
  results?: string | number;
}

const SearchBar = ({
  value,
  onChange,
  placeholderText = "Type something...",
  results = "",
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [showAlert, setShowAlert] = useState(false);

  const theme = useTheme();

  const focusInput = () => {
    // console.log("should be focused");
    inputRef.current?.focus();
  };
  const disableAlert = () => setShowAlert(false);

  const ctrlFAnimProps = {
    variants: {
      alert: {
        // border: `1px solid ${theme.colors.primary.main}`,
        boxShadow: `inset 0px 0px 0px 3px ${theme.colors.success.main}`,
        // outline: `5px solid ${theme.colors.success.main}`,
        transition: {
          // repeatType: "mirror",

          repeat: Infinity,
          repeatType: "mirror" as "mirror",
        },
      },
      none: {
        // border: `1px solid ${theme.colors.primary.main}`,

        // outline: `0px solid ${theme.colors.success.main}`,
        boxShadow: `inset 0px 0px 0px 0px ${theme.colors.success.main}`,
      },
    },
    initial: "none",
    animate: showAlert ? "alert" : "none",
  };

  useEffect(() => {
    const setFocus = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "f") setShowAlert(true);
    };

    window.addEventListener("keydown", setFocus);

    return () => {
      window.removeEventListener("keydown", setFocus);
    };
  }, []);

  return (
    <SBContainer onClick={focusInput} showAlert={showAlert} {...ctrlFAnimProps}>
      {/* <motion.span>
        <BiSearch />
      </motion.span> */}

      {/* {showAlert && <CtrlFAlert />} */}

      <Input
        ref={inputRef}
        type="search"
        value={showAlert ? "" : value}
        onChange={onChange}
        onFocus={disableAlert}
        placeholder={showAlert ? "" : placeholderText}
      />
      <p>{!showAlert && value && results}</p>
    </SBContainer>
  );
};

export default SearchBar;
