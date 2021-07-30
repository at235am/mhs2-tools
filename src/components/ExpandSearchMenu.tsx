// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { motion } from "framer-motion";

// custom components:
import TableSearchBar from "./TableSearchBar";

export const popOutMenuBaseStyles = (props: any) => css`
  z-index: 10;

  position: absolute;
  bottom: 0;
  right: 0;

  opacity: 0.94;
  backdrop-filter: blur(2px);

  background-color: ${props.theme.colors.surface.main};
  box-shadow: 0px 0px 20px -13px black;

  border-radius: 5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SearchBox = styled(motion.div)`
  ${popOutMenuBaseStyles}

  overflow: hidden;

  height: 4rem;
`;

const animationProps = {
  variants: {
    appear: { width: "100%", opacity: 0.94 },
    exit: { width: "0%", opacity: 0 },
  },
  initial: "exit",
  animate: "appear",
  exit: "exit",
};

type ExpandSearchMenuProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ExpandSearchMenu = ({ value, onChange }: ExpandSearchMenuProps) => {
  return (
    <SearchBox {...animationProps}>
      <TableSearchBar
        value={value}
        onChange={onChange}
        placeholderText="Filter monsties by name, egg color, ability, and more!"
      />
    </SearchBox>
  );
};

export default ExpandSearchMenu;
