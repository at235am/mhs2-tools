// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import { useEffect, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import { GeneSkill } from "../utils/ProjectTypes";
import { getBingoCountAndBonus } from "../utils/utils";

import Asset from "./AssetComponents";

// icons:
import { BsExclamationCircleFill } from "react-icons/bs";
import Alert from "./Alert";

const Container = styled.div<{ squareHeight: number }>`
  width: 100%;
  height: ${({ squareHeight }) => squareHeight}px;

  border-radius: 1rem;
  /* background-color: ${({ theme }) => theme.colors.surface.main}; */
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.surface.lighter};
`;

const Table = styled.table`
  width: 100%;
  height: 100%;
  padding: 1rem 1.5rem;

  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* align-items: center; */

  /* padding: 1rem; */
  gap: 1rem;

  thead,
  tbody {
    gap: 1rem;

    tr {
      /* background-color: ${({ theme }) => theme.colors.surface.main}; */
      /* margin-bottom: 0.5rem; */

      /* padding: 0.5rem 1rem; */
      /* border-radius: 5rem; */
      /* padding: 0 0.5rem; */

      td {
        /* border: 1px solid green; */
        /* min-height: 2rem; */
      }
    }
  }
`;

const gridStyles = () => css`
  display: grid;

  grid-template-columns: minmax(0, 6fr) minmax(3rem, 1fr) minmax(0, 3fr);

  grid-template-rows: minmax(1fr, 1fr);
  gap: 1rem;
`;

const Thead = styled.thead`
  display: flex;
  flex-direction: column;

  /* background-color: ${({ theme }) => theme.colors.background.main}; */

  border-radius: 1rem;
  /* padding: 0.5rem 0; */
  /* padding: 1rem; */

  /* border: 1px dashed red; */

  /* width: 100%; */
  /* margin-bottom: 0.5rem; */
  tr {
    ${gridStyles}

    td {
      display: flex;
      align-items: center;
      /* padding: 0 0.5rem; */
      /* padding: 0.5rem 0.75rem; */

      color: ${({ theme }) => theme.colors.onSurface.main};
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;

      padding: 0.5rem 0;

      /* padding: 0.2rem 1rem;
      padding-left: 0; */
    }
    td:nth-of-type(2) {
      padding: 0;
    }
    td:nth-of-type(3) {
    }
    td:nth-of-type(3) {
    }

    td:nth-of-type(2),
    td:nth-of-type(3) {
      /* font-family: monospace; */
      justify-content: center;
      align-items: center;
    }
  }
`;

const Tbody = styled.tbody`
  /* border: 1px dashed red; */

  /* padding: 1rem; */

  display: flex;
  flex-direction: column;

  tr {
    ${gridStyles}

    td {
      overflow: hidden;

      color: ${({ theme }) => theme.colors.onSurface.main};
      font-size: 1rem;
      text-transform: capitalize;
      white-space: nowrap;

      background-color: ${({ theme }) => theme.colors.surface.main};
      /* padding: 0.5rem 0.75rem; */

      padding: 0.5rem 0;
      border-radius: 5px;
      /* border: 1px dashed red; */

      display: flex;
      align-items: center;

      span {
        margin-right: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    td:nth-of-type(1) {
      font-weight: 600;
      padding-left: 0.8rem;
    }

    td:nth-of-type(2),
    td:nth-of-type(3) {
      font-family: monospace;
      font-weight: 600;

      justify-content: center;
      align-items: center;
    }
  }
`;

const TR = styled.tr<{ highlight: boolean }>`
  /* ${({ highlight, theme }) =>
    highlight
      ? css`
          td:nth-of-type(3),
          td:nth-of-type(4) {
            color: ${theme.colors.correct.main};
            font-weight: 700;
          }
        `
      : null} */
`;

const TD = styled.td`
  /* border: 1px dashed red; */
  display: flex;
`;

const NoBingoerror = styled.div`
  width: 100%;
  height: 100%;

  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const H = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: capitalize;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.error.dark};
  color: rgba(0, 0, 0, 1);

  /* color: ${({ theme }) => theme.colors.error.main}; */

  font-style: normal;

  /* margin: 0 3rem; */

  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const P = styled.p`
  /* margin: 0 3rem; */
  /* padding: 1rem; */

  color: ${({ theme }) => theme.colors.error.dark};
  color: ${({ theme }) => theme.colors.error.main};
  color: rgba(0, 0, 0, 1);

  font-style: italic;
  font-size: 0.9rem;

  /* font-weight: 600; */

  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  /* border: 1px dashed; */

  flex: 3;
`;

const Icon = styled.span`
  /* border: 1px dashed; */
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;

    path {
      /* fill: ${({ theme }) => theme.colors.surface.dark}; */
      fill: black;
      /* fill: ${({ theme }) => theme.colors.error.main}; */
    }
  }
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 18rem;

  border-radius: 5px;

  padding: 1rem;
  padding-left: 0;

  /* border: 1px solid ${({ theme }) => theme.colors.error.dark}; */
  /* border: 1px solid ${({ theme }) => theme.colors.error.main}; */

  /* background-color: ${({ theme }) =>
    rgba(theme.colors.error.darker, 0.1)}; */

  border-bottom: 3px solid #ffb907;
  background-color: ${({ theme }) => theme.colors.warning.darker};

  background-color: #ffcd4a;

  display: flex;
`;

type BingoBonusesProps = {
  geneBuild: GeneSkill[];
  className?: string;
  showBingosOnly?: boolean;
};

type CountBonus = {
  type: string;
  count: number;
  bonus: number;
};

const BingoBonuses = ({
  geneBuild,
  className,
  showBingosOnly = false,
}: BingoBonusesProps) => {
  const [bonuses, setBonuses] = useState<CountBonus[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: squareHeight = 0 } = useResizeObserver({ ref: containerRef });

  const renderList = bonuses.filter((bonus) => bonus.count > 0);
  // const renderList = bonuses;

  useEffect(() => {
    const freqs = getBingoCountAndBonus(geneBuild);

    if (showBingosOnly) setBonuses(freqs.filter(({ count }) => count > 0));
    else setBonuses(freqs);
  }, [geneBuild, showBingosOnly]);

  return (
    <Container
      ref={containerRef}
      squareHeight={squareHeight}
      className={className}
    >
      {renderList.length > 0 ? (
        <Table style={bonuses.length === 0 ? { gap: 0 } : {}}>
          <Thead>
            <tr>
              {/* <TD></TD> */}
              <TD>Type</TD>
              <TD>#</TD>
              <TD>Damage</TD>
            </tr>
          </Thead>
          <Tbody>
            {renderList.map(({ type, count, bonus }) => (
              <TR key={type} highlight={count > 0}>
                {/* <TD>
                  <Asset asset={type} size={20} />
                </TD> */}
                {/* <TD>{type.replace("-", " ")}</TD> */}
                <TD>
                  <Asset asset={type} size={20} />
                  {type}
                </TD>
                <TD>{count}</TD>
                <TD>{(bonus * 100).toFixed(0)} %</TD>
              </TR>
            ))}
          </Tbody>
        </Table>
      ) : (
        <NoBingoerror>
          {/* <Dialog>
            <Icon>
              <BsExclamationCircleFill />
            </Icon>
            <P>
              <H>No bingo</H>
              Try lining up elements or attack types by row, column, or diagnol
              to get a bingo bonus!
            </P>
          </Dialog> */}

          <Alert />
        </NoBingoerror>
      )}
    </Container>
  );
};

export default BingoBonuses;
