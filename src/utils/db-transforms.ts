import { nanoid } from "nanoid";
import { GeneBuild } from "../components/MonstieGeneBuild";
import { definitions } from "../types/supabase";
import { GeneSkill } from "./ProjectTypes";
import { BLANK_GENE, CLEAN_EMPTY_BOARD, DEFAULT_MONSTER } from "./utils";
import { replaceNullOrUndefined as unnullify } from "./utils";

export const createGeneBuild = (userId: string | null): GeneBuild => ({
  buildId: nanoid(),
  buildName: "",
  monstie: DEFAULT_MONSTER.mId,
  createdBy: userId,
  geneBuild: CLEAN_EMPTY_BOARD,
  insights: "",
});

export type DB_BuildInfo = {
  build_id: string;
  build_name: string;
  monstie: number;
};

export type DB_BuildPiece = {
  build_id: string;
  g_id: number | null;
  place: number;
};

export type DB_Build = {
  buildInfo: DB_BuildInfo;
  buildPieces: DB_BuildPiece[];
};

export const geneBuildToSqlTableFormat = (build: GeneBuild): DB_Build => {
  const buildInfo = {
    build_id: build.buildId,
    build_name: build.buildName,
    monstie: build.monstie,
    insights: build.insights,
  };

  const buildPieces = [
    ...build.geneBuild.map((gene, i) => ({
      build_id: build.buildId,
      g_id: gene.gId > 0 ? gene.gId : null,
      place: i,
    })),
  ];

  return { buildInfo, buildPieces };
};

type DB_Genes = definitions["genes"];
type DB_Skills = definitions["skills"];

export interface DB_GeneJoinSkill extends DB_Genes {
  skill: DB_Skills;
}

export const sanitizeGeneSkill = (geneSkill: DB_GeneJoinSkill): GeneSkill => {
  if (geneSkill === null || geneSkill === undefined || geneSkill.g_id === null)
    return BLANK_GENE;
  else {
    return {
      gId: unnullify(geneSkill?.g_id, -1),
      geneName: unnullify(geneSkill?.gene_name, ""),
      geneNumber: unnullify(geneSkill?.gene_number, -1),

      attackType: unnullify(geneSkill?.attack_type, "none"),
      elementType: unnullify(geneSkill?.element_type, "none"),
      traitType: unnullify(geneSkill?.trait_type, "passive"),
      requiredLvl: unnullify(geneSkill?.required_lvl, -1),
      size: unnullify(geneSkill?.size_abbr, "s"),
      skill: {
        skillName: unnullify(geneSkill?.skill?.skill_name, ""),
        target: unnullify(geneSkill?.skill?.target, ""),
        kinshipCost: unnullify(geneSkill?.skill?.kinship_cost, 0),
        otherMods: unnullify(geneSkill?.skill?.other_mods, ""),
        mv: unnullify(geneSkill?.skill?.mv, 0),
        actionSpeed: unnullify(geneSkill?.skill?.action_speed, 0),
        accuracy: unnullify(geneSkill?.skill?.accuracy, 0),
        critable: unnullify(geneSkill?.skill?.critable, false),
        critRateBonus: unnullify(geneSkill?.skill?.crit_rate_bonus, 0),
        aiUse: unnullify(geneSkill?.skill?.ai_use, false),
        description: unnullify(geneSkill?.skill?.description, ""),
        upgrade0: unnullify(geneSkill?.skill?.upgrade_0, ""),
        upgrade1: unnullify(geneSkill?.skill?.upgrade_1, ""),
        upgrade2: unnullify(geneSkill?.skill?.upgrade_2, ""),
        effect1: unnullify(geneSkill?.skill?.effect_1, ""),
        effect2: unnullify(geneSkill?.skill?.effect_2, ""),
        effect3: unnullify(geneSkill?.skill?.effect_3, ""),
      },
    };
  }
};
