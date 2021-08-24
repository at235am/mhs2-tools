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

const EmptyListWarning = styled.div`
  height: 100%;
  width: 100%;

  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.surface.lighter};
`;

type SkilsListProps = { className?: string; geneBuild: GeneSkill[] };

const SkillsList = ({ className, geneBuild }: SkilsListProps) => {
  const list = geneBuild.filter(
    (gene) => !isBlankGene(gene) && !(gene.gId === 17)
  );

  return (
    <Container
      className={className}
      onClick={() => console.log(geneBuild)}
      // threeColumnView={threeColumnView}
    >
      {list.map((gene, i) => (
        <SkillCard key={gene.gId} gene={gene} />
      ))}

      {list.length === 0 && <EmptyListWarning />}
    </Container>
  );
};

export default SkillsList;
