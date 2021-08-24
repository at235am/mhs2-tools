// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";
import { ELEMENT_COLOR, GeneSkill } from "../utils/ProjectTypes";
import { isBlankGene } from "../utils/utils";
import Asset from "./AssetComponents";
import color from "color";

import { MdAdd } from "react-icons/md";

const Container2 = styled.div`
  min-height: 12rem;
  border-radius: 1rem;

  border: 2px solid ${({ theme }) => theme.colors.surface.main};

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 2rem;
    height: 2rem;

    path {
      fill: ${({ theme }) => theme.colors.surface.main};
    }
  }
`;

const Container = styled.div`
  min-height: 12rem;
  border-radius: 1rem;
  padding: 1rem;

  background: ${({ theme }) =>
    `linear-gradient(125deg, ${theme.colors.surface.lighter} 54.7%, ${theme.colors.surface.main} 55%)`};

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RowContainer = styled.div`
  flex: 1;

  display: flex;
  gap: 0.5rem;
`;

const Bubble = styled.h5<{ w?: string; bg?: string }>`
  width: ${({ w }) => w};
  height: 2rem;
  padding: 0 1.1rem;

  overflow: hidden;

  border-radius: 10rem;

  background-color: ${({ theme }) =>
    theme.name === "dark" ? "#4b5561" : "#dadadc"};
`;

type BlankSkillCardProps = {
  version?: "blank" | "dotted";
};

const BlankSkillCard = ({ version = "dotted" }: BlankSkillCardProps) => {
  if (version === "dotted")
    return (
      <Container2>
        <MdAdd />
      </Container2>
    );

  return (
    <Container>
      <Bubble w="10rem" />

      <RowContainer>
        <Bubble w="4rem" />
        <Bubble w="3rem" />
      </RowContainer>

      <Bubble w="100%" />
    </Container>
  );
};

export default BlankSkillCard;
