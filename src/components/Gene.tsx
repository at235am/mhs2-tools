// styling:
import { css, keyframes, Theme, ThemeContext } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement, useState } from "react";

import color from "color";

// assets:

import Asset from "./AssetComponents";
import { ELEMENT_COLOR, ElementType, GeneSkill } from "../utils/ProjectTypes";
import { rgba } from "emotion-rgba";
import { motion } from "framer-motion";
import { formatGeneName } from "../utils/utils";
import Portal from "./DynamicPortal";
import SkillCard from "./SkillCard";

const octagonCssString = `polygon(
    50% 0,
    85% 15%,
    100% 50%,
    85% 85%,
    50% 100%,
    15% 85%,
    0 50%,
    15% 15%
  )`;

const GeneContainer = styled.div<{
  size: number | undefined;
  bringToFront: boolean;
}>`
  user-select: none;
  position: relative;

  width: ${({ size }) => (size ? `${size}px` : "100%")};
  height: ${({ size }) => (size ? `${size}px` : "100%")};
  max-width: ${({ size }) => (size ? `${size}px` : "100%")};
  max-height: ${({ size }) => (size ? `${size}px` : "100%")};
  min-width: ${({ size }) => (size ? `${size}px` : "100%")};
  min-height: ${({ size }) => (size ? `${size}px` : "100%")};
`;

const rainbowAnimation = keyframes`
  0%{background-position:0% 82%}
    50%{background-position:100% 19%}
    100%{background-position:0% 82%}
`;

const GeneOctagon = styled.div<{ c: string; rainbow: boolean }>`
  /* z-index: 10; */
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
  border-radius: 50%;

  background-color: ${({ c }) => c};
  clip-path: ${octagonCssString};
  /* transform: scale(0.8); */

  ${({ rainbow }) =>
    rainbow &&
    css`
      animation: ${rainbowAnimation} 10s linear infinite;
      background-size: 1800% 1800%;
      background-image: linear-gradient(
        90deg,
        #e81d1d,
        #e8b71d,
        #e3e81d,
        #1de840,
        #1ddde8,
        #2b1de8,
        #dd00f3,
        #dd00f3
      );
    `}
`;

const PowerType = styled.div<{ c?: string; rainbow: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate3d(-50%, -50%, 0);

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 90%;
      width: 90%;

      /* opacity: ${({ rainbow }) => (rainbow ? 1 : 1)}; */

      path,
      circle {
        fill: ${({ c, rainbow }) => (rainbow ? "white" : c)};
      }

      line {
        stroke: ${({ c, rainbow }) => (rainbow ? "white" : c)};
      }
    }
  }
`;

const GeneName = styled.p<{ c?: string; borderColor?: string }>`
  user-select: none;
  overflow: hidden;

  cursor: pointer;

  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);

  background-color: ${({ c }) => c};

  border-radius: 3px;
  height: 1.5rem;
  padding: 0.22rem 0;
  border-right: 0.5rem solid ${({ borderColor }) => borderColor};
  border-left: 0.5rem solid ${({ borderColor }) => borderColor};

  width: 100%;
  max-width: 100%;

  text-align: center;
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;

  &:hover {
    background-color: ${({ borderColor }) => borderColor};
  }

  /* clip-path: polygon(11% 0, 89% 0, 100% 50%, 89% 100%, 11% 100%, 0% 50%); */
`;

const GeneSize = styled.p`
  /* user-select: none; */

  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;

  width: 1.5rem;
  height: 1.5rem;

  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.onSurface.main};

  color: ${({ theme }) => theme.colors.surface.main};
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SkillContainer = styled.div`
  position: fixed;
  top: calc(100vh / 2);
  left: 50%;

  padding: 0 0.7rem;

  transform: translate3d(-50%, -50%, 0);

  width: 100%;
  max-width: 30rem;
`;

type GeneProps = {
  gene: GeneSkill;
  size?: number;
  disableSkillPreview?: boolean;
  bringToFront?: boolean;
};

const Gene = ({
  gene,
  size,
  bringToFront = false,
  disableSkillPreview = false,
}: GeneProps) => {
  // state:
  const [showSkill, setShowSkill] = useState(false);

  // colors:
  const geneColor = ELEMENT_COLOR[gene.elementType].main;
  const darkenGeneColor = ELEMENT_COLOR[gene.elementType].dark;
  const borderColor = color(geneColor).darken(0.35).hex();

  // formatted strings:
  const formattedGeneName = formatGeneName(gene.geneName);

  // misc:
  const isRainbowGene = gene.attackType === "all" && gene.elementType === "all";

  return (
    <GeneContainer size={size} bringToFront={bringToFront}>
      <GeneOctagon c={geneColor} rainbow={isRainbowGene}></GeneOctagon>
      <PowerType c={darkenGeneColor} rainbow={isRainbowGene}>
        <Asset asset={gene.attackType} />
      </PowerType>

      {!isRainbowGene && (
        <>
          <GeneSize>{gene.size}</GeneSize>
          <GeneName
            c={darkenGeneColor}
            borderColor={borderColor}
            onClick={() => {
              if (!disableSkillPreview) setShowSkill((v) => !v);
            }}
          >
            {formattedGeneName}
          </GeneName>
        </>
      )}

      {showSkill && !disableSkillPreview && (
        <Portal portalId="app" backdrop close={() => setShowSkill(false)}>
          <SkillContainer>
            <SkillCard gene={gene} />
          </SkillContainer>
        </Portal>
      )}
    </GeneContainer>
  );
};

export default Gene;
