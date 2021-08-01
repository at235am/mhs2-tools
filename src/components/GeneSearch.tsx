// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import {
  useEffect,
  useRef,
  useLayoutEffect,
  RefObject,
  useState,
  Fragment,
} from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import { useLongPress } from "use-long-press";

// types:
import {
  AttackType,
  MonstieGene,
  Skill,
  SkillType,
} from "../utils/ProjectTypes";
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
import DATA from "../utils/output.json";
import { DROP_TYPES } from "../utils/DropTypes";
import { clamp, EMPTY_GENE } from "../utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import Debug from "./Debug";
import usePagination from "../hooks/usePagination";

// icons:
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GiRoundStar } from "react-icons/gi";
import { ImHeart } from "react-icons/im";
import { HiPlus } from "react-icons/hi";
import { MdClose } from "react-icons/md";

const DummyWidthMeasurementDiv = styled.div`
  width: 100%;
`;

const Container = styled(motion.div)<{
  height?: number;
  dragging: boolean;
  padding: number;
}>`
  z-index: 1;

  position: absolute;
  bottom: 5rem;
  right: 0;

  width: 100%;

  padding: ${({ padding }) => padding}px 0;

  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.background.dark};
  background-color: ${({ theme }) => theme.colors.surface.main};
  box-shadow: 0px 0px 20px -13px black;

  max-height: ${({ height }) => height}px;

  ${({ dragging }) =>
    dragging
      ? css`
          overflow: hidden;
        `
      : null}
`;

const Results = styled(motion.div)`
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
    color: ${({ theme }) => theme.colors.error.darker};
    font-weight: 600;

    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const LB = styled(motion.button)<{ size?: number }>`
  width: 2.5rem;
  height: 2.5rem;

  margin-left: 0.5rem;

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

const FAB = styled(motion.button)`
  z-index: 50;

  position: absolute;
  bottom: 0;
  right: 0;

  border-radius: 50%;
  width: 4rem;
  height: 4rem;

  background-color: ${({ theme }) => theme.colors.primary.main};

  box-shadow: 0px 0px 20px 0px ${({ theme }) => theme.colors.primary.main};
  box-shadow: 0px 0px 20px -10px black;
  /* background: ${({ theme }) =>
    `linear-gradient(45deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`}; */

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;

    path {
      fill: ${({ theme }) => theme.colors.onPrimary.main};
    }
  }
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
    scale: 0.9,
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
    show: { opacity: 1, height: "auto", transition: { delay: 0.2 } },
    hide: {
      opacity: 0,
      height: "0",
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

const sanitizeGenes = (dirtyGenes: any) => {
  const cleanGenes: MonstieGene[] = [];

  dirtyGenes.forEach((gene: any) => {
    const cleanedGene: MonstieGene = {
      geneName: gene.gene_name,
      geneNumber: gene.gene_number,
      attackType: gene.attack_type ? (gene.attack_type as AttackType) : "",
      elementType: gene.element_type as ElementType,
      requiredLvl: gene.required_lvl,
      geneSize: gene.gene_size,
      skill: {
        skillName: gene.skill.name,
        skillType: gene.skill.type as SkillType,
        desc: gene.skill.desc,
      } as Skill,
      possessedBy: {
        native: gene.possessed_by.native,
        random: gene.possessed_by.random,
      },
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
};

const GeneSearch = ({
  setDrop,
  setDropSuccess,
  dropSuccess,
  rows = 2,
  itemSize = 85,
  itemPadding = 7,
}: GeneSearchProps) => {
  const theme = useTheme();
  const [genes, setGenes] = useState<MonstieGene[]>([]);
  const [searchResults, setSearchResults] = useState<MonstieGene[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { isMobile } = useUIState();

  const [draggingGene, setDraggingGene] = useState<MonstieGene | null>(null);
  const [isDragging, setIsDragging] = useState(true);
  const [dropMessage, setDropMessage] = useState("");

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
  // const searchBarHeight = 3 * 14;
  // const componentHeight = rows * resultItemSize.h + verticalPadding * 2;
  const componentHeight =
    rows * itemSize + rows * itemPadding * 2 + itemPadding * 2;

  // ANIMATION PROPS:
  const fabProps = {
    variants: {
      normal: { scale: 1, backgroundColor: theme.colors.primary.main },
      shrink: { scale: 0.75, backgroundColor: theme.colors.error.light },
    },
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

  const isDraggingGene = (gene: MonstieGene) =>
    gene.geneName === draggingGene?.geneName;

  const setSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  useEffect(() => {
    const dataFromApiCall = DATA.genes;
    const cleanGenes = sanitizeGenes(dataFromApiCall);
    setGenes(cleanGenes);
    setSearchResults(cleanGenes.slice(0, 20));
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
      const search = searchTerm.toLowerCase().trim();

      const newResults = genes.filter((val) =>
        val.geneName.toLowerCase().includes(search)
      );
      setSearchResults(newResults);
    }
  }, [searchTerm, genes]);

  useEffect(() => {
    if (!isDragging && !dropSuccess) {
      setDropMessage("Drop failed: Duplicate gene!");
    } else {
      setDropMessage("");
    }
  }, [isDragging, dropSuccess]);

  const GeneItem = (gene: MonstieGene) => (
    <GeneContainer key={gene.geneName} padding={itemPadding}>
      <DraggableGene
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
        // opacity={isDraggingGene(gene) ? 1 : 0}
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
      <DummyWidthMeasurementDiv ref={dummyParentContainerRef} />
      <FAB type="button" {...fabProps} onClick={toggleSearch}>
        {showSearch ? <MdClose /> : <HiPlus />}
      </FAB>
      <AnimatePresence>
        {showSearch && (
          <Controls>
            <LB key="prev" onClick={prev} {...navButtonAnimation} custom={1}>
              <MdKeyboardArrowLeft />
            </LB>
            <LB key="next" onClick={next} {...navButtonAnimation} custom={0}>
              <MdKeyboardArrowRight />
            </LB>
            {/* <LB onClick={next} size={16}>
              <ImHeart />
            </LB> */}
          </Controls>
        )}
        {showSearch && (
          <ExpandSearchMenu
            key="gene-search"
            value={searchTerm}
            onChange={setSearch}
            placeholderText="Search for a gene.."
          />
        )}

        {showSearch && (
          <Fragment key="idk">
            <FlashTooltip text={`Page: ${page.number + 1} of ${totalPages}`} />
            <FlashTooltip text={dropMessage} />
          </Fragment>
        )}
        {showSearch && (
          <Container
            {...hideResultsAnimation}
            padding={itemPadding}
            key="results-container"
            height={componentHeight}
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
          </Container>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeneSearch;

{
  /* <p>
          {page.number + 1}/{totalPages}
        </p>
        <p>
          {" " + pageResult.length}/{resultsPerPage + " "}
        </p>
        <p>Results: {searchResults.length}</p> */
}