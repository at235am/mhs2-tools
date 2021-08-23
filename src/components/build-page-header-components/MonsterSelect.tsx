// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import { useMemo, useState, useEffect, useRef } from "react";

// custom components:
import Portal from "../DynamicPortal";
import { PatternType } from "../Egg";

// utils:
import supabase from "../../utils/supabase";

// icons:
import { BiSearch } from "react-icons/bi";
import { MdArrowDropDown, MdClose } from "react-icons/md";
import BPHTemplate from "./BuildPageHeaderTemplate";
import { useUIState } from "../../contexts/UIContext";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  /* max-height: 20rem; */
`;

const ValueBox = styled.button`
  /* border: 1px dashed; */

  position: relative;

  min-height: 3rem;

  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.surface.lighter};

  display: flex;
  align-items: center;
  /* gap: 1rem; */

  &:hover {
    p {
      color: ${({ theme }) => theme.colors.primary.main};
    }
    svg {
      path {
        fill: ${({ theme }) => theme.colors.primary.main};
      }
    }

    img {
      filter: brightness(150%);
    }
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ValueText = styled.p`
  /* border: 1px dashed; */

  /* max-width: 100%; */

  margin-left: 0.75rem;
  flex: 1;
  flex-shrink: 1;
  /* color: ${({ theme }) => theme.colors.primary.main}; */

  font-size: 1.5rem;
  font-weight: 700;
  /* white-space: nowrap; */

  display: flex;
  justify-content: flex-start;
`;

const imgStyles = css`
  width: 5rem;
  height: 5rem;
  min-width: 5rem;
  min-height: 5rem;
  max-width: 5rem;
  max-height: 5rem;

  padding: 0.5rem;

  border-radius: 5px;

  image-rendering: pixelated;
`;

const Img = styled.img`
  ${imgStyles}
`;

const EmptyImg = styled.div`
  ${imgStyles}
`;

const IconButton = styled.span`
  /* border: 1px dashed red; */

  width: 5rem;
  height: 5rem;
  min-width: 5rem;
  min-height: 5rem;
  max-width: 5rem;
  max-height: 5rem;
  background-color: transparent;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArrowDownIcon = styled(MdArrowDropDown)`
  /* border: 1px dashed; */

  /* position: absolute; */
  right: 0;
  top: 0;

  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
`;

const PopoutMenuContainer = styled.div`
  position: fixed;
  top: 5rem;
  left: 0;

  padding: 5rem 0;

  width: 100%;
  max-width: 100%;

  height: calc(100vh - 5rem);

  overflow-x: hidden;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  /* HIDES SCROLLBARS BUT STILL SCROLLABLE */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const FilterContainer = styled.div`
  z-index: 10;

  position: sticky;
  top: 0;

  width: calc(100% - 2rem);
  max-width: 40rem;

  &:hover {
    svg {
      path {
        fill: ${({ theme }) => theme.colors.primary.main};
      }
    }
  }
`;

const FilterInput = styled.input`
  padding: 1.5rem 2rem;
  /* margin-bottom: 2rem; */

  border-radius: 5rem;

  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(3px);
  width: 100%;

  color: black;

  font-size: 1.25rem;
  font-weight: 600;

  &::placeholder {
    font-size: inherit;
  }
`;

const SearchIcon = styled(BiSearch)`
  position: absolute;
  right: 0;
  top: 11px;
  margin-right: 1rem;

  width: 3rem;
  height: 3rem;

  path {
    fill: ${({ theme }) => theme.colors.primary.main};
    fill: gray;
  }
`;

const Select = styled(motion.ul)`
  color: black;
  color: white;
  width: 25rem;

  display: flex;
  flex-direction: column;

  gap: 1rem;
`;

const Option = styled.li`
  cursor: pointer;

  display: flex;

  border-radius: 5px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};

    img {
      filter: brightness(0%);
    }
    p {
      color: black;
    }
  }
`;

const OptionText = styled.p`
  user-select: none;
  white-space: nowrap;

  padding: 1rem 1rem;

  color: white;
  font-size: 2rem;
  font-weight: 600;

  flex: 1;

  display: flex;
  align-items: center;
`;

const ExitButton = styled.button`
  position: fixed;
  top: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px;
  right: 0;
  /* margin: 1rem; */
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;

  width: 4rem;
  height: 4rem;
  svg {
    height: 2rem;
    width: 2rem;
  }

  &:hover {
    svg {
      path {
        fill: ${({ theme }) => theme.colors.error.dark};
      }
    }
  }
`;

type InputProps = {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

const AutoFocusInput = ({ filter, setFilter }: InputProps) => {
  const filterSearchRef = useRef<HTMLInputElement>(null);
  const { isMobile } = useUIState();

  useEffect(() => {
    if (!isMobile) filterSearchRef.current?.focus();
  }, []);

  return (
    <FilterContainer>
      <FilterInput
        ref={filterSearchRef}
        placeholder="Filter monsters by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        onFocus={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      <SearchIcon />
    </FilterContainer>
  );
};

const IMG_URL_PREFIX = process.env.REACT_APP_MONSTER_IMAGE_BUCKET_URL;
const getImageUrl = (imgUrl: string) => `${IMG_URL_PREFIX}/${imgUrl}`;

type SelectOption = {
  mId: number;
  monsterName: string;
  imgUrl: string;
  eggInfo: {
    patternType: PatternType;
    patterColor: string;
    bgColor: string;
    metaColors: string[];
  };
};

type Props = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean;
};

const MonsterSelect = ({ value, setValue, disabled = false }: Props) => {
  const [monsterList, setMonsterList] = useState<SelectOption[]>([]);
  const [filter, setFilter] = useState("");
  const [dropdown, setDropdown] = useState(false);

  const fuse = useMemo(
    () =>
      new Fuse(monsterList, {
        keys: ["monsterName"],
        includeScore: true,
        shouldSort: true,
        threshold: 0.3,
      }),
    [monsterList]
  );

  const renderList =
    filter === "" ? monsterList : fuse.search(filter).map(({ item }) => item);

  const selectedMonster = monsterList.find((mon) => mon.mId === value);

  const toggleDropdown = () => {
    setDropdown((v) => !v);
  };

  useEffect(() => {
    const fetchMonsters = async () => {
      const { data, error } = await supabase
        .from("monsters")
        .select("m_id, monster_name, img_url, egg (*)")
        .eq("hatchable", true)
        .eq("statline.lvl", 1)
        .order("monster_name");

      if (data && !error) {
        const options: SelectOption[] = data.map((mon) => {
          const egg = mon.egg[0];

          return {
            mId: mon.m_id,
            monsterName: mon.monster_name,
            imgUrl: mon.img_url,
            eggInfo: {
              patternType: egg.pattern_type,
              patterColor: egg.pattern_color,
              bgColor: egg.bg_color,
              metaColors: egg.meta_colors,
            },
          };
        });
        setMonsterList(options);
      }

      if (error) console.error(error);
    };

    fetchMonsters();
  }, []);

  return (
    <BPHTemplate titleLabel="Monstie">
      <Container>
        <ValueBox onClick={toggleDropdown} disabled={disabled}>
          {selectedMonster ? (
            <Img
              src={getImageUrl(selectedMonster?.imgUrl)}
              alt={selectedMonster?.monsterName}
            />
          ) : (
            <EmptyImg />
          )}
          <ValueText>{selectedMonster?.monsterName}</ValueText>

          {!disabled && (
            <IconButton>
              <ArrowDownIcon />
            </IconButton>
          )}
        </ValueBox>

        {dropdown && (
          <Portal
            portalId="app"
            backdrop
            close={() => {
              setDropdown(false);
              setFilter("");
            }}
          >
            <PopoutMenuContainer
              onClick={(e) => {
                setDropdown(false);
                setFilter("");
              }}
            >
              <ExitButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown(false);
                }}
              >
                <MdClose />
              </ExitButton>
              <AutoFocusInput filter={filter} setFilter={setFilter} />
              <Select
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {renderList.map((mon) => (
                  <Option
                    key={mon.mId}
                    onClick={() => {
                      setValue(mon.mId);
                      setDropdown(false);
                      setFilter("");
                    }}
                  >
                    <Img src={getImageUrl(mon.imgUrl)} alt={mon.monsterName} />
                    <OptionText>{mon.monsterName}</OptionText>
                  </Option>
                ))}
                {renderList.length === 0 && (
                  <Option
                    onClick={() => {
                      setFilter("");
                    }}
                  >
                    <OptionText>No results.</OptionText>
                  </Option>
                )}
              </Select>
            </PopoutMenuContainer>
          </Portal>
        )}
      </Container>
    </BPHTemplate>
  );
};

export default MonsterSelect;
