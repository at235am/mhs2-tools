// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

// library:
import { Link, match } from "react-router-dom";
import { useEffect, useMemo, useState, useRef, memo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";

//hooks:
import useDrop from "../hooks/useDrop";
import { useUIState } from "../contexts/UIContext";
import { useAuth } from "../contexts/AuthContext";

// custom component:
import BingoBoard from "../components/BingoBoard";
import GeneSearch from "../components/GeneSearch";
import FloatingPoint from "../components/FloatingPoint";
import TextInput from "../components/TextInput";
import BingoBonuses from "../components/BingoBonuses";
import ObtainableGeneList from "../components/ObtainableGeneList";
import SkillsList from "../components/SkillsList";
import Gutter from "../components/Gutter";
import BuildPageNotification from "../components/BuildPageNotification";
import MonsterSelect from "../components/build-page-header-components/MonsterSelect";

// types:
import { GeneSkill } from "../utils/ProjectTypes";
import { GeneBuild } from "../components/MonstieGeneBuild";

// utils:
import {
  cleanGeneBuild,
  CLEAN_EMPTY_BOARD,
  decodeBase64UrlToGeneBuild,
  DEFAULT_MONSTER,
  encodeGeneBuildToBase64Url,
  shuffleArray,
} from "../utils/utils";
import { GENE_BUILDS } from "../utils/LocalStorageKeys";
import { replaceNullOrUndefined as unnullify } from "../utils/utils";

// database:
import { saveUserBuild } from "../utils/db-inserts";
import supabase from "../utils/supabase";
import { sanitizeGeneSkill } from "../utils/db-transforms";

// icons:
import { RiFundsFill } from "react-icons/ri";
import { MdContentCopy, MdClose, MdEdit, MdShare } from "react-icons/md";
import { User } from "@supabase/supabase-js";
import ShareLink from "../components/build-page-header-components/ShareLink";
import UserBuildInfo from "../components/build-page-header-components/UserBuildInfo";
import TextArea from "../components/TextArea";
import useResizeObserver from "use-resize-observer/polyfilled";
import Debug from "../components/Debug";
import Tooltip from "../components/Tooltip";

const Container = styled.div`
  /* border: 2px dashed green; */
  position: relative;

  width: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;

  /* padding-bottom: 10rem; */

  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    align-items: center;
  }
`;

const HeaderContainer = styled.div`
  /* border: 1px dashed; */
  width: 100%;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 2rem;
`;

const oneColumn = css`
  display: flex;
  flex-direction: column;
`;

const twoColumn = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(20rem, 1fr));
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "board bonus"
    "skills hunt"
    "insights  insights";
`;

const threeColumn = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(20rem, 1fr));
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "board bonus skills"
    "hunt  hunt  skills"
    "insights  insights  insights";
`;

const BodyContainer = styled.div<{ columns: number }>`
  /* border: 1px dashed; */
  width: 100%;
  gap: 2rem;

  ${({ columns }) => {
    if (columns === 1) return oneColumn;
    else if (columns === 2) return twoColumn;
    else return threeColumn;
  }}
`;

const Section = styled.section`
  /* border: 1px dashed red; */

  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 1rem;
`;

const BoardSection = styled(Section)`
  grid-area: board;
  /* border: 1px dashed red; */
`;

const SkillsSection = styled(Section)`
  grid-area: skills;
  /* border: 1px dashed blue; */
`;

const BonusSection = styled(Section)`
  grid-area: bonus;
  /* border: 1px dashed orange; */
`;

const HuntListSection = styled(Section)`
  grid-area: hunt;
  /* border: 1px dashed yellow; */
`;

const InsightsSection = styled(Section)`
  grid-area: insights;
`;

const Heading = styled.h1`
  width: 100%;

  font-weight: 700;
  font-size: 3rem;

  color: ${({ theme }) => theme.colors.onSurface.main};
`;

const headingHeight = 2.5;

const subHeadingStyles = (props: any) => css`
  color: ${props.theme.colors.onSurface.main};

  /* min-height: ${headingHeight}rem; */
  /* max-height: ${headingHeight}rem; */
  font-weight: 700;
  font-size: 2rem;

  margin-left: 0.25rem;
`;

const SubHeading = styled.h2`
  ${subHeadingStyles}

  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BackLink = styled(Link)`
  margin-left: 0.2rem;

  width: 100%;
  &:link,
  &:visited,
  &:hover,
  &:active {
    color: white;
    font-weight: 700;
    font-style: italic;
    text-decoration: underline;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const SHARE_LINK_PREFIX = `${process.env.REACT_APP_DOMAIN}/builds/`;
const getShareLink = (build: GeneBuild) => {
  if (build.createdBy) return `${SHARE_LINK_PREFIX}${build.buildId}`;
  else return `${SHARE_LINK_PREFIX}${encodeGeneBuildToBase64Url(build)}`;
};

type PageProps = {
  match: match<{ id: string }>;
};

export type BuildMetaInfo = {
  buildType: "user" | "local" | "anon" | "invalid";
  isCreator: boolean;
};

const BuildPage = ({ match }: PageProps) => {
  const { user } = useAuth();
  // STATE:
  const [columns, setColumns] = useState(3);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver({
    ref: containerRef,
    onResize: (_) => {
      if (headerContainerRef.current) {
        const t = window
          .getComputedStyle(headerContainerRef.current)
          .getPropertyValue("grid-template-columns")
          .split(" ").length;

        setColumns(t);
      }
    },
  });

  // DATA STATE:
  const [geneBuild, setGeneBuild] = useState<GeneSkill[]>(CLEAN_EMPTY_BOARD);
  const [buildName, setBuildName] = useState("");
  const [monstie, setMonstie] = useState(DEFAULT_MONSTER.mId);
  const [buildDescription, setBuildDescription] = useState("");

  // COMPONENT STATE:
  const [buildMetaData, setBuildMetaData] = useState<BuildMetaInfo>({
    buildType: "invalid",
    isCreator: false,
  });

  const [loading, setLoading] = useState(true);
  const [showForkModal, setShowForkModal] = useState(false);

  const [dropSuccess, setDropSuccess] = useState(false);
  const { drop, setDrop } = useDrop();
  const { isMobile } = useUIState();

  // DERIVED STATE:
  const floatPointOffset = isMobile ? 10.5 : 28;
  const buildId = match.params.id;
  const shareLink = getShareLink({
    buildId,
    buildName,
    monstie,
    geneBuild,
    createdBy: user ? user.id : null,
    insights: buildDescription,
  });

  const shuffle = () => setGeneBuild((list) => shuffleArray([...list]));
  const clearBuild = () => setGeneBuild(CLEAN_EMPTY_BOARD);

  const findLocalBuild = (targetBuildId: string) => {
    const allLocalBuilds: GeneBuild[] | null = JSON.parse(
      window.localStorage.getItem(GENE_BUILDS) || "null"
    );

    if (allLocalBuilds)
      return allLocalBuilds.find((build) => build.buildId === targetBuildId);
    else return null;
  };

  const saveToLocalStorage = (newData: GeneBuild) => {
    const allLocalBuilds: GeneBuild[] | null = JSON.parse(
      window.localStorage.getItem(GENE_BUILDS) || "null"
    );

    if (allLocalBuilds) {
      const buildIndex = allLocalBuilds.findIndex(
        (builds) => builds.buildId === buildId
      );

      const arr =
        buildIndex !== -1
          ? [
              ...allLocalBuilds.slice(0, buildIndex),
              ...allLocalBuilds.slice(buildIndex + 1, allLocalBuilds.length),
            ]
          : allLocalBuilds;

      const t = [...arr, newData];

      window.localStorage.setItem(GENE_BUILDS, JSON.stringify(t));
    }
  };

  const save = (build: GeneBuild) => {
    if (build.createdBy) {
      saveUserBuild(build);
    } else saveToLocalStorage(build);
  };

  const debouncedSave = useCallback(debounce(save, 1000), []);

  useEffect(() => {
    if (headerContainerRef.current) {
      const t = window
        .getComputedStyle(headerContainerRef.current)
        .getPropertyValue("grid-template-columns")
        .split(" ").length;

      setColumns(t);
    }
  }, []);

  useEffect(() => {
    const buildId = match.params.id;

    const fetch = async () => {
      setLoading(true);
      let validUserBuild = false;
      let validLocalBuild = false;
      let validAnonBuild = false;

      // 1. see if a user build exists for the current buildId:
      const { data, error } = await supabase
        .from("buildinfo")
        .select("*")
        .eq("build_id", buildId);
      if (data && !error) validUserBuild = data.length > 0;
      else if (error) console.error(error);

      // 2. see if a local build exists for the current buildId:
      validLocalBuild = !!findLocalBuild(buildId);

      // 3. see if a anon build exists for the current buildId:
      validAnonBuild = !(await decodeBase64UrlToGeneBuild(buildId)).error;

      // SET BUILD META DATA:
      // NOTE: that isCreator is tightly coupled with the type of build
      // this is because of how we omit creator_id when saving to local storage
      if (validUserBuild)
        setBuildMetaData({
          buildType: "user",
          isCreator: data?.[0].creator_id === user?.id,
        });
      else if (validLocalBuild)
        setBuildMetaData({ buildType: "local", isCreator: true });
      else if (validAnonBuild)
        setBuildMetaData({ buildType: "anon", isCreator: false });
      else setBuildMetaData({ buildType: "invalid", isCreator: false });

      setLoading(false);
    };

    fetch();
  }, [match.params.id, user]);

  useEffect(() => {
    const buildId = match.params.id;

    ///////////////////////////////// USER BUILD /////////////////////////////////
    if (buildMetaData.buildType === "user") {
      const fetchBuild = async () => {
        const { data, error } = await supabase
          .from("buildinfo")
          .select(
            "*, buildpieces:buildpiece(place, g_id, gene:genes(*, skill:skills(*)))"
          )
          // .eq("creator_id", user?.id)
          .eq("build_id", buildId)
          .order("place", {
            foreignTable: "buildpiece",
            ascending: true,
          });

        if (error) console.error(error);

        if (data?.length === 0) {
          // setLoading(false);
        }

        if (data && data.length > 0) {
          const res = data[0];
          const build = {
            buildId: res.build_id,
            buildName: res.build_name,
            monstie: res.monstie,
            createdBy: res.creator_id,
            insights: unnullify(res.insights, ""),
            geneBuild: cleanGeneBuild(
              res.buildpieces.map((bp: any) => {
                return sanitizeGeneSkill({
                  ...bp.gene,
                  skill: bp.gene?.skill[0],
                });
              })
            ),
          };

          setBuildName(build.buildName);
          setMonstie(build.monstie);
          setBuildDescription(build.insights);
          setGeneBuild(build.geneBuild);
        }

        setLoading(false);
      };

      fetchBuild();
    }
    ///////////////////////////////// LOCAL BUILD /////////////////////////////////
    else if (buildMetaData.buildType === "local") {
      const localBuild = findLocalBuild(buildId);

      setBuildName(localBuild?.buildName || "");
      setMonstie(localBuild?.monstie || 33);
      setBuildDescription(localBuild?.insights || "");
      setGeneBuild(cleanGeneBuild(localBuild?.geneBuild || []));

      setLoading(false);
    }
    ///////////////////////////////// ANON BUILD /////////////////////////////////
    else if (buildMetaData.buildType === "anon") {
      const fetchAnonBuild = async () => {
        const { error, build: anonBuild } = await decodeBase64UrlToGeneBuild(
          buildId
        );

        setBuildName(anonBuild.buildName);
        setMonstie(anonBuild.monstie);
        setBuildDescription("");
        setGeneBuild(anonBuild.geneBuild);

        setLoading(false);
      };

      fetchAnonBuild();
    }
    ///////////////////////////////// INVALID BUILD /////////////////////////////////
    else {
      setLoading(false);
    }
  }, [match.params.id, buildMetaData, user]);

  useEffect(() => {
    const { isCreator } = buildMetaData;

    if (isCreator) {
      debouncedSave({
        buildId,
        buildName,
        monstie,
        geneBuild,
        createdBy: user ? user.id : null,
        insights: buildDescription,
      });
    }
  }, [
    buildName,
    monstie,
    geneBuild,
    buildId,
    buildDescription,
    user,
    buildMetaData,
  ]);

  return (
    <>
      <BuildPageNotification
        metaInfo={buildMetaData}
        editButtonAction={() => {
          console.log("yes");
        }}
      />
      <Gutter>
        <Container ref={containerRef}>
          {showForkModal && <div>FORK</div>}

          {loading && <div>loading</div>}

          {buildMetaData.buildType === "invalid" && !loading && (
            <div>invalid url</div>
          )}

          {buildMetaData.buildType !== "invalid" && !loading && (
            <>
              <BackLink to="/builds">&lt;- Back to your build list</BackLink>

              <HeaderContainer ref={headerContainerRef}>
                <UserBuildInfo
                  username={user ? user.id.slice(0, 10) : "Anonymous"}
                  buildName={buildName}
                  setBuildName={setBuildName}
                  disabled={!buildMetaData.isCreator}
                />
                <MonsterSelect
                  value={monstie}
                  setValue={setMonstie}
                  disabled={!buildMetaData.isCreator}
                />
                <ShareLink link={shareLink} />
              </HeaderContainer>

              <BodyContainer columns={columns}>
                <BoardSection>
                  <SubHeading>Bingoboard</SubHeading>

                  <BingoBoard
                    // size={boardSize}
                    geneBuild={geneBuild}
                    setGeneBuild={setGeneBuild}
                    drop={drop}
                    setDrop={setDrop}
                    setDropSuccess={setDropSuccess}
                    disabled={!buildMetaData.isCreator}
                  />
                </BoardSection>

                <BonusSection>
                  <SubHeading>Bonuses</SubHeading>
                  <BingoBonuses geneBuild={geneBuild} showBingosOnly={false} />
                </BonusSection>

                <SkillsSection>
                  <SubHeading>Skills</SubHeading>
                  <SkillsList geneBuild={geneBuild} />
                </SkillsSection>

                <HuntListSection>
                  <SubHeading>Hunt List</SubHeading>
                  <ObtainableGeneList />
                </HuntListSection>

                <InsightsSection>
                  <SubHeading>
                    Insights
                    {!user && (
                      <Tooltip
                        text="You are not logged in, so if you share your build, it won't have your insights!"
                        label="Insight Warning"
                        textBubbleWidth={200}
                      />
                    )}
                  </SubHeading>
                  <TextArea
                    value={buildDescription}
                    setValue={setBuildDescription}
                    maxLength={5000}
                    disabled={!buildMetaData.isCreator}
                    placeholder="Provide insight, strategies, and analysis so that other users can have a deeper understanding of how to fully utilize your build!"
                  />
                </InsightsSection>
              </BodyContainer>

              {/* <SubContainer>
                <BoardSection size={boardSize}></BoardSection>
              </SubContainer> */}

              {buildMetaData.isCreator && (
                <FloatingPoint
                  parentContainerRef={containerRef}
                  bottom={floatPointOffset}
                >
                  <GeneSearch
                    setDrop={setDrop}
                    setDropSuccess={setDropSuccess}
                    dropSuccess={dropSuccess}
                  />
                </FloatingPoint>
              )}
            </>
          )}
        </Container>
      </Gutter>
    </>
  );
};

export default BuildPage;
