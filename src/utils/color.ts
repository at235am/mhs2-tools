import { ELEMENT_COLOR as EC } from "../utils/ProjectTypes";

export const rainbowTextGradient = (degree = 150) =>
  `repeating-linear-gradient(
    ${degree}deg,
    ${EC["fire"].main} ,
    ${EC["thunder"].main} ,
    #49d0b0 ,
    ${EC["water"].main} ,
    ${EC["dragon"].main} ,
    ${EC["fire"].main}
)`;
