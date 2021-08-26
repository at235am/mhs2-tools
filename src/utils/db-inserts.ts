import { User } from "@supabase/supabase-js";
import { GeneBuild } from "../components/MonstieGeneBuild";
import { geneBuildToSqlTableFormat } from "./db-transforms";
import { GENE_BUILDS } from "./LocalStorageKeys";
import supabase from "./supabase";

export const saveUserBuild = async (build: GeneBuild) => {
  const sqlForm = geneBuildToSqlTableFormat(build);
  const { error: error1 } = await supabase
    .from("buildinfo")
    .upsert([sqlForm.buildInfo]);

  const { error: error2 } = await supabase
    .from("buildpiece")
    .upsert(sqlForm.buildPieces);

  if (error1) console.error(error1);
  if (error2) console.error(error2);

  return !error1 && !error2;
};

export const syncDatabaseWithLocalStorage = async (user: User | null) => {
  if (!user) return false;

  const localBuilds = window.localStorage.getItem(GENE_BUILDS) || "[]";

  try {
    const data: GeneBuild[] = JSON.parse(localBuilds);
    // const t = data.map((build) => ({ ...build, createdBy: user.id }));
    // console.log(t);

    const promises = Promise.all(
      data.map((build) => saveUserBuild({ ...build, createdBy: user.id }))
    );
    const buildSaveStatuses = await promises;
    const allBuildsSaved = buildSaveStatuses.every(
      (saveStatus) => saveStatus === true
    );
    if (allBuildsSaved) {
      window.localStorage.setItem(GENE_BUILDS, "[]");
      return true;
    } else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
