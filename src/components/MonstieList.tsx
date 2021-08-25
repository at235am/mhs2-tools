// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import {
  useState,
  useEffect,
  useRef,
  ReactElement,
  useMemo,
  SetStateAction,
  Dispatch,
} from "react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";

// custom hooks:
import useTable, { ColumnProps, InputData } from "../hooks/useTable";

// custom components:
import MonstieCard from "./MonstieCard";
import SortMenu from "./ExpandSortMenu";
import ExpandSearchMenu, { popOutMenuBaseStyles } from "./ExpandSearchMenu";

// icons:
import { BiSearch } from "react-icons/bi";
import { MdSort } from "react-icons/md";
import FloatingPoint from "./FloatingPoint";
import Portal from "./DynamicPortal";
import FloatingActionButton from "./FloatingActionButton";
import useVirtualScroll from "../hooks/useVirtualScroll";
import useResizeObserver from "use-resize-observer/polyfilled";
import Debug from "./Debug";
import { AttackType, ElementType } from "../utils/ProjectTypes";
import { PatternType } from "./Egg";
import LvlMenu from "./LvlMenu";

const Container = styled.div<{ listHeight: number; gridPadding: number }>`
  position: relative;

  /* border: 1px dashed red; */
  /* display: flex;
  flex-wrap: wrap; */
  padding-top: ${({ gridPadding }) => gridPadding}px;

  display: grid;
  gap: 1rem;

  /* 18rem -> supports 280px devices */
  /* 21.5rem -> supports 280px devices */
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(14rem, 14rem));

  height: ${({ listHeight }) => listHeight}px;
  min-height: ${({ listHeight }) => listHeight}px;
  max-height: ${({ listHeight }) => listHeight}px;
`;

const SearchFAB = styled(FloatingActionButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const SortFAB = styled(FloatingActionButton)`
  position: absolute;
  bottom: 5rem;
  right: 0;
`;

const btnAnimationProps = {
  whileHover: {},
  whileTap: { scale: 0.75 },
};

export type MonsterAtLvl = {
  mId: number;
  monsterName: string;
  ability1: string;
  ability2: string;
  elementStrength: ElementType;
  elementWeakness: ElementType;
  attackType: AttackType;
  genus: string;
  rarity: number;
  habitat: string;
  hatchable: boolean;
  retreatCondition: string;
  imgUrl: string;

  eggPatternType: PatternType;
  eggBgColor: string;
  eggPatternColor: string;
  eggMetaColors: string[];

  lvl: number;
  speed: number;
  crit: number;
  hp: number;
  recovery: number;

  "atk_non-elemental": number;
  atk_fire: number;
  atk_water: number;
  atk_thunder: number;
  atk_ice: number;
  atk_dragon: number;

  "def_non-elemental": number;
  def_fire: number;
  def_water: number;
  def_thunder: number;
  def_ice: number;
  def_dragon: number;
};

type MonstieListProps = {
  data: MonsterAtLvl[];
  column: ColumnProps[];
  defaultColumnWidth?: number;

  lvl: number;
  setLvl: Dispatch<SetStateAction<number>>;
};

const MonstieList = ({ data, column, lvl, setLvl }: MonstieListProps) => {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({
    ref: listContainerRef,
    onResize: (_) => {
      if (listContainerRef.current) {
        const t = window
          .getComputedStyle(listContainerRef.current)
          .getPropertyValue("grid-template-columns")
          .split(" ").length;

        setItemsPerRow(t);
      }
    },
  });
  const [itemsPerRow, setItemsPerRow] = useState(1);

  const {
    toggleMultiSort,
    toggleSort,
    toggleShiftSort,
    columnAttrs,
    tableData,
    shiftHeld,
    sorts,
    filterData,
  } = useTable(data, column, 150);

  const { listHeight, renderList, blankHeight } = useVirtualScroll(
    useMemo(
      () => ({
        list: tableData,
        listContainerRef,
        itemHeight: 14 * 14, // 14rem
        itemPadding: 14, // 1rem
        itemsPerRow,
      }),
      [tableData, listContainerRef, itemsPerRow]
    )
  );

  const [showSort, setShowSort] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [eggMode, setEggMode] = useState(false);

  const toggleShowSort = () => {
    setShowSearch(false);
    setShowSort((v) => !v);
  };
  const toggleShowSearch = () => {
    setShowSort(false);
    setShowSearch((v) => !v);
  };

  const setSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const theme = useTheme();

  const staticProps = {
    variants: {
      normal: { scale: 1, backgroundColor: theme.colors.primary.main },
      shrink: { scale: 0.75, backgroundColor: theme.colors.danger.light },
    },
    initial: "normal",
    animate: showSearch ? "shrink" : "normal",
  };

  const staticProps2 = {
    variants: {
      normal: { x: "0rem", backgroundColor: theme.colors.primary.main },
      move: { x: "-0.5rem", backgroundColor: theme.colors.danger.light },
    },
    initial: "normal",
    animate: showSort ? "move" : "normal",
  };

  useEffect(() => {
    filterData(searchText);
  }, [searchText]);

  return (
    <>
      <Portal portalId="floating-point-monstie-list">
        <SortFAB
          size="m"
          {...btnAnimationProps}
          {...staticProps2}
          onClick={toggleShowSort}
        >
          <MdSort />
        </SortFAB>

        <SearchFAB size="l" {...staticProps} onClick={toggleShowSearch}>
          <BiSearch />
        </SearchFAB>
        <AnimatePresence>
          {showSearch && (
            <ExpandSearchMenu
              key="search"
              value={searchText}
              onChange={setSearch}
              placeholderText="Filter monsties by name, egg color, ability, and more!"
            />
          )}
          {showSort && (
            <SortMenu
              key="sort-menu"
              columnAttrs={columnAttrs}
              toggleShiftSort={toggleShiftSort}
            />
          )}
          {showSort && <LvlMenu lvl={lvl} setLvl={setLvl} />}
        </AnimatePresence>
      </Portal>

      <Container
        ref={listContainerRef}
        listHeight={listHeight}
        gridPadding={blankHeight}
        onClick={() => setEggMode((v) => !v)}
      >
        {renderList.map((mon) => (
          <MonstieCard key={mon.mId} monster={mon} showEgg={eggMode} />
        ))}
      </Container>
    </>
  );
};

export default MonstieList;
