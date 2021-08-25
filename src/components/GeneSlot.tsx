// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement, forwardRef } from "react";
import { useDrop } from "react-dnd";
import { GeneSkill } from "../utils/ProjectTypes";
import { ELEMENT_COLOR } from "../utils/ProjectTypes";

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

const EC = ELEMENT_COLOR;

export const rainbowGradient = (degree = 160) =>
  `repeating-linear-gradient(
    ${degree}deg,
    ${EC["fire"].main} 0%,
    ${EC["thunder"].main} 6%,
    #49d0b0 12%,
    ${EC["water"].main} 18%,
    ${EC["dragon"].main} 24%,
    ${EC["fire"].main} 30%
)`;

const Container = styled.div`
  position: relative;
  width: 90%;
  height: 90%;

  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;

  margin: auto;
  border-radius: 50%;
  /*
    putting a transform on this container breaks background-attachment: fixed on firefox
    so we have to settle for setting the width and height to be 90% instead
    which means this component needs to be centered by its parent >:()
  */
  /* transform: scale(0.9); */

  background-attachment: fixed;
  background-image: ${rainbowGradient()};
`;

const SlotHole = styled.div<{ isOver: boolean }>`
  position: absolute;
  top: 0;
  left: 0;

  transform: scale(0.9);

  width: 100%;
  height: 100%;
  border-radius: 50%;

  transform: scale(0.85);

  background-color: ${({ theme }) => theme.colors.surface.main};

  /* background-color: ${({ isOver, theme }) =>
    isOver ? theme.colors.success.main : theme.colors.background.main}; */

  /* border: 5px solid ${({ theme }) => theme.colors.background.main}; */

  /* clip-path: ${octagonCssString}; */

  display: flex;
  justify-content: center;
  align-items: center;
`;

type GeneSlotProps = {
  index: number;
  // updateBoard: (index: number, gene: MonstieGene) => void;
  // swapGenes: (initialIndex: number, targetIndex: number) => void;
  // swapGenes: (initialIndex: number, gene: MonstieGene) => void;
  // children?: ReactElement;
};

const GeneSlot = forwardRef<HTMLDivElement, GeneSlotProps>(({ index }, ref) => {
  return (
    <Container ref={ref}>
      <SlotHole isOver={false} />
    </Container>
  );
});

export default GeneSlot;
