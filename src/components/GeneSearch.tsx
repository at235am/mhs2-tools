// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { useEffect, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";

// types:
import { AttackType, GeneSkill, Skill, TraitType } from "../utils/ProjectTypes";
// import { ElementType } from "./MonstieCard";

// hooks:
import { useUIState } from "../contexts/UIContext";
import { DropProps } from "../hooks/useDrop";

// custom components:
import DraggableGene from "./DraggableGene";
import Gene from "./Gene";
import TableSearchBar from "./TableSearchBar";
import FlashTooltip from "./FlashTooltip";
import { ElementType } from "../utils/ProjectTypes";
import ExpandSearchMenu from "./ExpandSearchMenu";

// data:
import GENES_DATA from "../utils/genes.json";

import { DROP_TYPES } from "../utils/DropTypes";
import { AnimatePresence, motion } from "framer-motion";
import Debug from "./Debug";
import usePagination from "../hooks/usePagination";

// icons:
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GiRoundStar } from "react-icons/gi";
import { ImHeart } from "react-icons/im";
import { MdClose, MdAdd } from "react-icons/md";
import FloatingActionButton from "./FloatingActionButton";
import supabase from "../utils/supabase";
import Fuse from "fuse.js";
import { isNullishCoalesce } from "typescript";
import { cleanGeneBuild } from "../utils/utils";
import { rgba } from "emotion-rgba";
import { useHistory } from "react-router-dom";

const DummyWidthMeasurementDiv = styled.div`
  width: 100%;
`;

const Container = styled(motion.div)<{
  height?: number;
  dragging: boolean;
  padding: number;
}>`
  z-index: 1;

  /* outline: 1px solid white; */

  position: absolute;
  bottom: 5rem;
  right: 0;

  width: 100%;

  padding: ${({ padding }) => padding}px 0;

  border-radius: 1rem;
  /* background-color: ${({ theme }) => theme.colors.surface.main}; */
  box-shadow: 0px 0px 20px -13px black;

  /* opacity: 0.94; */

  /* max-height: ${({ height }) => height}px; */

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  ${({ dragging }) =>
    dragging
      ? css`
          overflow: hidden;
        `
      : null}

  &::after {
    content: "";

    position: absolute;
    left: 0;
    top: 0;

    width: 100%;
    height: 100%;

    border-radius: 1rem;

    /* opacity: 0.94; */
    backdrop-filter: blur(2px);

    /* background-color: ${({ theme }) => theme.colors.surface.main}; */
    background-color: ${({ theme }) =>
      rgba(theme.colors.background.darker, 0.94)};
  }
`;

const ResultInfo = styled.div`
  /* border: 1px dashed green; */

  z-index: 100;

  position: relative;

  height: 2.5rem;
  min-height: 2.5rem;
  max-height: 2.5rem;
  /* background-color: ${({ theme }) => theme.colors.background.main}; */

  /* margin: 0 1rem; */
  /* border-radius: 5rem; */

  padding: 0 1rem;

  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const PageInfo = styled.p`
  border-radius: 5rem;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.background.main};
  background-color: ${({ theme }) => theme.colors.onSurface.dark};

  color: ${({ theme }) => theme.colors.background.darker};
  padding: 0 0.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;

  /* font-weight: 600; */

  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-right: 0.4rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: inherit;
  }
`;

const Results = styled(motion.div)`
  /* border: 1px dashed red; */

  z-index: 100;

  position: relative;
  /* top: 0; */
  /* left: 0; */

  height: 100%;
  width: 100%;

  flex-wrap: wrap;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const GeneContainer = styled.div<{ padding: number }>`
  position: relative;
  padding: ${({ padding }) => padding}px;

  /* background-color: red; */
`;

const ShadowItem = styled(GeneContainer)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  opacity: 0.5;
`;

const Controls = styled.div`
  z-index: 50;

  position: absolute;
  bottom: 0.5rem;
  right: 4rem;

  height: 3rem;
  /* width: 100px; */
  /* background-color: red; */

  display: flex;
  justify-content: center;
  align-items: center;

  p {
    height: 100%;
    padding: 0 1rem;
    /* padding-left: 1rem; */

    /* margin: 0 5px; */
    /* background-color: ${({ theme }) => theme.colors.onSurface.main}; */
    color: ${({ theme }) => theme.colors.danger.darker};
    font-weight: 600;

    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const LB = styled(motion.button)<{ size?: number }>`
  width: 2.5rem;
  height: 2.5rem;

  /* margin-left: 0.5rem; */

  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.onSurface.dark};

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
    svg {
      path {
        fill: ${({ theme }) => theme.colors.onPrimary.main};
      }
    }
  }

  svg {
    width: ${({ size }) => (size ? `${size}px` : "1.5rem")};
    height: ${({ size }) => (size ? `${size}px` : "1.5rem")};

    path {
      fill: ${({ theme }) => theme.colors.surface.main};
    }
  }
`;

const FAB = styled(FloatingActionButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const EmptyResult = styled.div<{ size: number }>`
  /* border: 1px dashed red; */

  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
`;

const pageVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 500 : -500,
      opacity: 1,
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    };
  },
};

const tapAnimation = {
  whileTap: {
    scale: 0.85,
  },
};

const pageAnimation = {
  variants: pageVariants,
  initial: "enter",
  animate: "center",
  exit: "exit",
  transition: {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  },
};

const hideResultsAnimation = {
  variants: {
    show: {
      opacity: 1,
      height: "auto",
      transition: { delay: 0.2, duration: 0.25 },
    },
    hide: {
      opacity: 0,
      height: "0",
      transition: { duration: 0.25 },
    },
  },

  initial: "hide",
  animate: "show",
  exit: "hide",
};

const navButtonAnimation = {
  variants: {
    show: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: 0.1 + 0.1 * i },
    }),
    hide: (i: number) => ({
      opacity: 0,
      scale: 0,
      transition: { delay: 0.2 - 0.1 * i },
    }),
  },
  initial: "hide",
  animate: "show",
  exit: "hide",
  ...tapAnimation,
};

export const sanitizeGenes = (dirtyGenes: any) => {
  const cleanGenes: GeneSkill[] = [];
  // console.log("dg", dirtyGenes);
  dirtyGenes.forEach((gene: any) => {
    const skill = gene.skill[0];

    const cleanedGene: GeneSkill = {
      gId: gene.g_id,
      geneName: gene.gene_name,
      geneNumber: gene.gene_number,

      attackType: gene.attack_type as AttackType,
      elementType: gene.element_type as ElementType,
      traitType: gene.trait_type,
      requiredLvl: gene.required_lvl,
      size: gene.size_abbr,
      skill: {
        skillName: skill.skill_name,
        target: skill.target,
        kinshipCost: skill.kinship_cost,
        otherMods: skill.other_mods,
        mv: skill.mv,
        actionSpeed: skill.action_speed,
        accuracy: skill.accuracy,
        critable: skill.critable,
        critRateBonus: skill.crit_rate_bonus,
        aiUse: skill.ai_use,
        description: skill.description,
        upgrade0: skill.upgrade_0,
        upgrade1: skill.upgrade_1,
        upgrade2: skill.upgrade_2,
        effect1: skill.effect1,
        effect2: skill.effect2,
        effect3: skill.effect3,
      } as Skill,
      // possessedBy: {
      //   native: [],
      //   random: [],
      // },
    };

    cleanGenes.push(cleanedGene);
  });

  return cleanGenes;
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

type GeneSearchProps = {
  setDrop: React.Dispatch<React.SetStateAction<DropProps>>;
  setDropSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  dropSuccess: boolean;
  rows?: number;
  itemSize?: number;
  itemPadding?: number;
  scrollIntoView: () => void;
};

const GeneSearch = ({
  setDrop,
  setDropSuccess,
  dropSuccess,
  rows = 2,
  itemSize = 85,
  itemPadding = 7,
  scrollIntoView,
}: GeneSearchProps) => {
  const history = useHistory();
  const theme = useTheme();
  const [genes, setGenes] = useState<GeneSkill[]>([]);
  const [searchResults, setSearchResults] = useState<GeneSkill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { isMobile } = useUIState();

  const [draggingGene, setDraggingGene] = useState<GeneSkill | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropMessage, setDropMessage] = useState("");

  const fuse = new Fuse(genes, {
    keys: ["geneName", "attackType", "elementType"],
    includeScore: true,
    shouldSort: true,
    threshold: 0.3,
  });

  // browseMode refers to whether the user is browsing the results by swiping or clicking through the pages
  // browseMode should be set to false when they start dragging a gene else where
  // an overflow: hidden is applied to the Container element depending on the browseMode
  const [browseMode, setBrowseMode] = useState(true);

  // pagination:
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const { pageResult, totalPages, page, nextPage, prevPage } = usePagination(
    searchResults,
    resultsPerPage
  );

  // for measuring:
  const dummyParentContainerRef = useRef<HTMLDivElement>(null);
  const { width: parentContainerWidth } = useResizeObserver({
    ref: dummyParentContainerRef,
  });

  // DERIVED ATTRIBUTES:

  // const componentHeight =
  //   rows * itemSize +
  //   rows * itemPadding * 2 +
  //   itemPadding * 2 +
  //   14 * 2 +
  //   14 / 2;
  const componentHeight =
    rows * itemSize +
    rows * itemPadding * 2 +
    itemPadding * 2 +
    14 * 2 +
    14 / 2;
  // const componentHeight =
  //   rows * itemSize + rows * itemPadding * 2 + itemPadding * 2;

  // ANIMATION PROPS:
  const fabProps = {
    variants: {
      normal: {
        scale: 1,

        backgroundColor: "#222222",
      },
      shrink: {
        scale: 0.75,
        backgroundColor: theme.colors.danger.main,
        // transition: { delay: 0.5 },
      },
    },
    whileTap: { scale: 0.75 },
    initial: "normal",
    animate: showSearch ? "shrink" : "normal",
  };

  const next = () => {
    setBrowseMode(true);
    nextPage();
  };

  const prev = () => {
    setBrowseMode(true);
    prevPage();
  };

  const toggleSearch = () => {
    setBrowseMode(true);
    setShowSearch((v) => !v);
  };

  const isDraggingGene = (gene: GeneSkill) =>
    gene.geneName === draggingGene?.geneName;

  const setSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  useEffect(() => {
    const fetchAllGeneSkills = async () => {
      let { data, error } = await supabase
        .from("genes")
        .select("*, skill:skills(*)")
        .neq("element_type", null);

      if (!error) {
        const cleanGenes = sanitizeGenes(data);
        // console.log({ cleanGenes });
        setGenes(cleanGenes);
        // setSearchResults(cleanGenes.slice(0, 20));
      } else {
        console.error(error);
        setGenes([]);
      }
    };

    fetchAllGeneSkills();
  }, []);

  // recalculate pagination parameters:
  useEffect(() => {
    const itemWidth = itemSize + itemPadding * 2;

    const itemsPerPage =
      Math.floor((parentContainerWidth || 0) / itemWidth) * rows;

    setResultsPerPage(itemsPerPage);
  }, [parentContainerWidth, rows, itemSize, itemPadding]);

  useEffect(() => {
    if (searchTerm === "") setSearchResults(genes);
    else {
      const sr = fuse.search(searchTerm);
      const newResults = sr.map(({ item }) => item);

      setSearchResults(newResults);
    }
  }, [searchTerm, genes]);

  // useEffect(() => {
  //   if (!isDragging && !dropSuccess) {
  //     setDropMessage("Drop failed: Duplicate gene!");
  //   } else {
  //     setDropMessage("");
  //   }
  // }, [isDragging, dropSuccess]);

  const GeneItem = (gene: GeneSkill) => (
    <GeneContainer key={gene.gId} padding={itemPadding}>
      <DraggableGene
        key={gene.gId}
        size={itemSize}
        gene={gene}
        onDragStart={() => {
          setDraggingGene(gene);
          setDropSuccess(false);
          setBrowseMode(false);
          setIsDragging(true);
        }}
        onDragEnd={(_, info) => {
          setIsDragging(false);

          setDrop({
            type: DROP_TYPES.GENE_PLACE,
            position: info.point,
            data: gene,
          });
        }}
        opacity={isDraggingGene(gene) && dropSuccess ? 0 : 1}
        bringToFront={isDraggingGene(gene)}
        longPressToDrag
      />
      {isDraggingGene(gene) && (
        <ShadowItem padding={itemPadding}>
          <Gene gene={gene} />
        </ShadowItem>
      )}
    </GeneContainer>
  );

  return (
    <>
      {/* <Debug data={{ resultsPerPage }} drag /> */}
      <DummyWidthMeasurementDiv ref={dummyParentContainerRef} />
      <FAB
        type="button"
        {...fabProps}
        onClick={() => {
          toggleSearch();
          if (!showSearch) scrollIntoView();
        }}
      >
        {showSearch ? <MdClose /> : <MdAdd />}
      </FAB>
      <AnimatePresence>
        {showSearch && (
          <ExpandSearchMenu
            key="gene-search"
            value={searchTerm}
            onChange={setSearch}
            placeholderText="Search by a gene's name, element, or type"
          />
        )}

        {showSearch && (
          <Container
            onClick={() => {
              // console.log(genes);
            }}
            {...hideResultsAnimation}
            padding={itemPadding}
            key="results-container"
            // height={componentHeight}
            dragging={browseMode || !showSearch}
            // ref={resultContainerRef}
          >
            <Results
              {...pageAnimation}
              className="results"
              key={page.number}
              drag={isMobile ? "x" : false}
              dragElastic={1}
              dragConstraints={{ left: 0, right: 0 }}
              custom={page.direction}
              onDragStart={() => {
                setBrowseMode(true);
              }}
              onDragEnd={(_, info) => {
                const { offset, velocity } = info;
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) next();
                else if (swipe > swipeConfidenceThreshold) prev();
              }}
            >
              {pageResult.map((gene) => GeneItem(gene))}
              {[...Array(resultsPerPage - pageResult.length).keys()].map(
                (val) => (
                  <EmptyResult
                    size={itemSize + itemPadding * 2}
                    key={`empty-result-${val}`}
                  />
                )
              )}
            </Results>
            <ResultInfo>
              <PageInfo>
                <span>Results</span>
                {searchResults.length}
              </PageInfo>
              <PageInfo>
                <span>Page</span>
                {`${page.number + 1} of ${totalPages}`}
              </PageInfo>

              {/* <Controls> */}
              <LB key="prev" onClick={prev} {...tapAnimation}>
                <MdKeyboardArrowLeft />
              </LB>
              <LB key="next" onClick={next} {...tapAnimation}>
                <MdKeyboardArrowRight />
              </LB>
              {/* </Controls> */}
            </ResultInfo>
          </Container>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeneSearch;
