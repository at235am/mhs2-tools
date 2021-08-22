export const ELEMENT_COLOR = {
  "non-elemental": {
    main: "#858585",
    light: "#949494",
    dark: "#6D6D6D",
    darker: "black",
  },
  fire: {
    main: "#FB494A",
    light: "#fc6c6d",
    dark: "#f30507",
    darker: "black",
  },
  water: {
    main: "#51ACFE",
    light: "#76befe",
    dark: "#1F94FE",
    darker: "black",
  },
  thunder: {
    main: "#FFCD4A",
    light: "#ffd76f",
    dark: "#EDAB00",
    darker: "black",
  },
  ice: { main: "#7EDEFF", light: "#a8e9ff", dark: "#32CBFF", darker: "black" },
  dragon: {
    main: "#C72EFF",
    light: "#d258ff",
    dark: "#A500E2",
    darker: "black",
  },
  all: {
    main: "#49d0b0",
    light: "#49d0b0",
    dark: "#49d0b0",
    darker: "#49d0b0",
  },

  none: { main: "black", light: "black", dark: "black", darker: "black" },
};

// console.log(JSON.stringify(ELEMENT_COLOR));

export type ElementType = keyof typeof ELEMENT_COLOR;

export type TraitType = "active" | "passive";
export type AttackType = "power" | "technical" | "speed" | "none" | "all";
export type GeneSkillSize = "S" | "M" | "L" | "XL";

export type StrictElement = Exclude<ElementType, "" | "none" | "all">;
export type StrictAttack = Exclude<AttackType, "" | "none" | "all">;

export type Skill = {
  skillName: string;
  target: string;
  kinshipCost: number;
  otherMods: string;
  mv: number;
  actionSpeed: number;
  accuracy: number;
  critable: boolean;
  critRateBonus: number;
  aiUse: boolean;
  description: string;
  upgrade0: string;
  upgrade1: string;
  upgrade2: string;
  effect1: string;
  effect2: string;
  effect3: string;
};

export type GeneSkill = {
  gId: number;
  geneName: string;
  geneNumber: number;

  attackType: AttackType;
  elementType: ElementType;
  traitType: TraitType;

  requiredLvl: number;
  size: GeneSkillSize;

  skill: Skill;
  // kinshipCost: number;
  // possessedBy: { native: string[]; random: string[] };
};
