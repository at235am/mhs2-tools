// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";

import { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import { useHistory } from "react-router-dom";
import base64url from "base64url";

//hooks:
import useDrop from "../hooks/useDrop";

// custom component:
import BingoBoard from "../components/BingoBoard";
import GeneSearch from "../components/GeneSearch";
import FloatingPoint from "../components/FloatingPoint";
import { useUIState } from "../contexts/UIContext";
import { GeneSkill } from "../utils/ProjectTypes";
import MonstieGeneBuild, { GeneBuild } from "../components/MonstieGeneBuild";
// import { FAB } from "../components/MonstieList";

import { definitions } from "../types/supabase";
import { replaceNullOrUndefined as unnullify } from "../utils/utils";

// icons:
import { MdAdd } from "react-icons/md";
import Gutter from "../components/Gutter";
import FloatingActionButton from "../components/FloatingActionButton";
import { useAuth } from "../contexts/AuthContext";
import { BLANK_GENE, cleanGeneBuild } from "../utils/utils";
import { GENE_BUILDS } from "../utils/LocalStorageKeys";
import supabase from "../utils/supabase";
import {
  createGeneBuild,
  DB_Build,
  geneBuildToSqlTableFormat,
  sanitizeGeneSkill,
} from "../utils/db-transforms";
import {
  saveUserBuild,
  syncDatabaseWithLocalStorage,
} from "../utils/db-inserts";

const Container = styled.div`
  /* border: 2px dashed green; */

  position: relative;

  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    /* align-items: center; */
  }
`;

const Heading = styled.h2`
  font-weight: 700;

  font-size: 3rem;
  margin-bottom: 1rem;

  color: ${({ theme }) => theme.colors.onSurface.main};

  display: flex;
`;

const CreateFAB = styled(FloatingActionButton)`
  position: absolute;
  right: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    bottom: 0;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.s + 1}px) {
    top: 0;
  }
`;

const BuildList = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(15rem, 14rem));
`;

const TeamBuilderPage = () => {
  // STATE:
  const history = useHistory();
  const { user } = useAuth();
  const { isMobile } = useUIState();
  const [builds, setBuilds] = useState<GeneBuild[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const saveBuildToLocalStorage = (build: GeneBuild) => {
    const oldBuilds = window.localStorage.getItem(GENE_BUILDS) || "[]";

    window.localStorage.setItem(
      GENE_BUILDS,
      JSON.stringify([...JSON.parse(oldBuilds), build])
    );
  };

  const createBuild = () => {
    const newBuild = createGeneBuild(user ? user.id : null);

    if (user) saveUserBuild(newBuild);
    else saveBuildToLocalStorage(newBuild);

    history.push(`/builds/${newBuild.buildId}`);
  };

  // useEffect(() => {
  //   console.log("ue, start sync");
  //   syncDatabaseWithLocalStorage(user);
  // }, [user]);

  useEffect(() => {
    ////////////////////////// LOGGED IN USER ///////////////////////////
    if (user) {
      const fetchUserBuilds = async () => {
        const success = await syncDatabaseWithLocalStorage(user);

        // fetch data:
        const { data, error } = await supabase
          .from("buildinfo")
          .select(
            "*, buildpieces:buildpiece(place, g_id, gene:genes(*, skill:skills(*)))"
          )
          .eq("creator_id", user?.id)
          .order("place", {
            foreignTable: "buildpiece",
            ascending: true,
          });

        if (data) {
          // process data:
          const builds: GeneBuild[] = data.map((build) => {
            return {
              buildId: build.build_id,
              buildName: build.build_name,
              monstie: build.monstie,
              createdBy: build.creator_id,
              insights: build.insights,
              geneBuild: cleanGeneBuild(
                build.buildpieces.map((bp: any) => {
                  return sanitizeGeneSkill({
                    ...bp.gene,
                    skill: bp.gene?.skill[0],
                  });
                })
              ),
            };
          });

          setBuilds(builds);
        }
        if (error) {
          console.error(error);
        }
      };
      fetchUserBuilds();
    }
    ////////////////////////// LOCAL STORAGE ///////////////////////////
    else {
      const data = window.localStorage.getItem(GENE_BUILDS) || "";
      setBuilds(data ? JSON.parse(data) : []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) window.localStorage.setItem(GENE_BUILDS, JSON.stringify(builds));
  }, [builds]);

  // DERIVED STATE:
  // const floatPointOffset = isMobile ? 10.5 : 28;
  const floatPointOffset = isMobile ? { bottom: 10.5 } : { top: 28 };

  return (
    <Gutter>
      <Container ref={containerRef}>
        <Heading
          onClick={() => {
            const fetchMonsters = async () => {
              const { data, error } = await supabase
                .from("monsters")
                .select(
                  `*,
                  statlines:statline (*),
                  egg (*)
                `
                )
                .eq("hatchable", true)
                .eq("statline.lvl", 1);
              // .filter("statline.lvl", "eq", 1);

              if (error) console.error(error);
            };

            const fetchGeneAc = async () => {
              const listOfGeneIds = [78, 74, 85, 95, 26];

              const { data, error } = await supabase
                .from("geneacquisition")
                .select("*, geneData:genes(*), monsters(*)")
                .in("g_id", listOfGeneIds);

              if (error) console.error(error);
            };

            fetchGeneAc();
          }}
        >
          Gene Builds
        </Heading>
        <Heading>{user?.id}</Heading>

        {builds.length === 0 && <p>Your builds looking a bit empty..</p>}

        <BuildList>
          {builds.map((build) => (
            <MonstieGeneBuild key={build.buildId} build={build} />
          ))}
        </BuildList>
        <FloatingPoint parentContainerRef={containerRef} {...floatPointOffset}>
          <CreateFAB type="button" onClick={createBuild}>
            <MdAdd />
          </CreateFAB>
        </FloatingPoint>
      </Container>
    </Gutter>
  );
};

export default TeamBuilderPage;
