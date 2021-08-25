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

export const lightGradientString = (
  degree = 160,
  intensity = { start: 0, end: 0.25 }
) =>
  `
  linear-gradient(
    ${degree}deg,
    rgba(255, 255, 255, ${intensity.start}),
    rgba(255, 255, 255, ${intensity.end})
  );
  `;

export const darkGradientString = (
  degree = 160,
  intensity = { start: 0, end: 0.25 }
) =>
  `
  linear-gradient(
    ${degree}deg,
    rgba(0, 0, 0, ${intensity.start}),
    rgba(0, 0, 0, ${intensity.end})
  );
  `;
