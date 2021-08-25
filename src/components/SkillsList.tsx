// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useMemo } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import {
  ElementType,
  ELEMENT_COLOR,
  GeneSkill,
  TraitType,
} from "../utils/ProjectTypes";
import { isBlankGene } from "../utils/utils";
import Asset from "./AssetComponents";
import BlankSkillCard from "./BlankSkillCard";
import Debug from "./Debug";
import Dialog from "./Dialog";
import SkillCard from "./SkillCard";

const cardMinWidth = 20;
const minInPixels = cardMinWidth * 14;

const Container = styled.div<{ threeColumnView?: boolean }>`
  /* border: 2px dashed red; */
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 100%;
  height: 100%;
`;

const EmptyListContainer = styled.div`
  height: 100%;
  width: 100%;

  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.surface.lighter};

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

type SkilsListProps = { className?: string; geneBuild: GeneSkill[] };

const SkillsList = ({ className, geneBuild }: SkilsListProps) => {
  const list = geneBuild.filter(
    (gene) => !isBlankGene(gene) && !(gene.gId === 17)
  );

  return (
    <Container className={className}>
      {list.map((gene) => (
        <SkillCard key={gene.gId} gene={gene} />
      ))}

      {list.length === 0 && (
        <EmptyListContainer>
          <Dialog
            type="danger"
            title="no genes detected"
            text="Try adding a gene!"
          />
          <Dialog
            type="info"
            title="hint 1"
            text="You can add a gene by clicking on the (+) button on the bottom right"
          />
          <Dialog
            type="info"
            title="hint 2"
            text="Click, hold, and drag the gene to the bingoboard"
          />
          <Dialog
            type="info"
            title="hint 3"
            text="When searching genes, you can click on its name to see more details."
          />
        </EmptyListContainer>
      )}
    </Container>
  );
};

export default SkillsList;
