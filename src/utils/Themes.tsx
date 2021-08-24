/** @jsxImportSource @emotion/react */
import { css, Global, useTheme } from "@emotion/react";
// custom type definitions (FOUND IN @type/emotion.d.ts):
import {
  Dimension,
  Font,
  Theme,
  Breakpoints,
  Color,
  MainColor,
} from "@emotion/react";

import styled from "@emotion/styled";
import ColorString from "color";

/**
 * Creates a spread of colors based on a "main" color
 * @args color is an object with at least a "main" property
 * @returns Returns a Color object
 */
const createColorSpread = (color: MainColor): Color => {
  const mainColor = ColorString(color.main);

  return {
    lighter: color.lighter ? color.lighter : mainColor.lighten(0.2).hex(),
    light: color.light ? color.light : mainColor.lighten(0.1).hex(),
    main: color.main,
    dark: color.dark ? color.dark : mainColor.darken(0.1).hex(),
    darker: color.darker ? color.darker : mainColor.darken(0.2).hex(),
  };
};

const ccs = createColorSpread;

export const dimensions: Dimension = {
  unit: 14,
  mainNav: {
    maxWidth: 100,
    maxHeight: 70,
  },
  subNav: {
    maxWidth: 60,
    maxHeight: 60,
  },
};

export const baseFont: Font = {
  size: dimensions.unit,
  family: "Inter, sans-serif",
  weight: "400",
};

export const bp: Breakpoints = {
  xs: 350,
  s: 550,
  m: 1366,
  l: 1920,
  xl: 2560,
  xxl: 4096,
};

export const darkTheme: Theme = {
  name: "dark",
  dimensions,
  font: baseFont,
  breakpoints: bp,
  colors: {
    // primary: ccs({ main: "#49d0b0" }),
    // primary: ccs({ main: "#2de9b7" }),
    primary: ccs({ main: "#49d0b0", darker: "#007258" }),
    secondary: ccs({ main: "#2dc3e9" }),

    background: ccs({ main: "#2e3035" }),
    surface: ccs({ main: "#36383e" }),

    // background: ccs({ main: "#1f1f1f" }),
    // surface: ccs({ main: "#181818" }),

    // background: ccs({ main: "#36383e" }),
    // surface: ccs({ main: "#2e3035" }),

    // background: ccs({ main: "#2c333b" }),
    // surface: ccs({ main: "#363f49" }),

    // background: ccs({ main: "#363f49" }),
    // surface: ccs({ main: "#2c333b" }),

    onPrimary: ccs({ main: "#ffffff" }),
    onSecondary: ccs({ main: "#ffffff" }),

    onBackground: ccs({ main: "#ffffff" }),
    onSurface: ccs({ main: "#ffffff" }),

    // error: ccs({ main: "#ff6b6b" }),
    // error: ccs({ main: "#ff6b6b", light: "#fd3131" }),
    error: ccs({ main: "#ff5b5b", light: "#fd5050" }),

    correct: ccs({ main: "#37d7b2" }),
    warning: ccs({ main: "#fee257" }),
  },
};

export const lightTheme: Theme = {
  name: "light",
  dimensions,
  font: baseFont,
  breakpoints: bp,
  colors: {
    // primary: ccs({ main: "#49d0b0", light: "#bbf3fb" }),
    // primary: ccs({ main: "#2de9b7", light: "#bbf3fb" }),
    primary: ccs({ main: "#49d0b0", light: "#bbf3fb", darker: "#007258" }),
    secondary: ccs({ main: "#6c63ff" }),

    // background: ccs({ main: "#f6f8fc", dark: "#e9eef8", darker: "#f6f6f6" }),
    background: ccs({ main: "#f2f2f2", dark: "#e9eef8", darker: "#f6f6f6" }),
    // background: ccs({ main: "#f6f6f6", light: "#f6f8fc", dark: "#e9eef8" }),
    surface: ccs({ main: "#ffffff", lighter: "#e6e6e7" }),

    onPrimary: ccs({ main: "#ffffff" }),
    onSecondary: ccs({ main: "#000000" }),

    onBackground: ccs({ main: "#2d4665" }),
    onSurface: ccs({ main: "#09090a" }),

    error: ccs({ main: "#fd3131", light: "#ff5b5b" }),

    correct: ccs({ main: "#37d7b2" }),
    warning: ccs({ main: "#fee257" }),
    // primary: ccs({ main: "#43dbab" }),
    // secondary: ccs({ main: "#6c63ff" }),

    // background: ccs({ main: "#edf0f5", light: "#f5f5f5" }),
    // surface: ccs({ main: "#ffffff" }),

    // onPrimary: ccs({ main: "#ffffff" }),
    // onSecondary: ccs({ main: "#000000" }),

    // onBackground: ccs({ main: "#363f49" }),
    // onSurface: ccs({ main: "#2c333b" }),

    // error: ccs({ main: "#fd3131", light: "#ff5b5b" }),

    // correct: ccs({ main: "#37d7b2" }),
    // warning: ccs({ main: "#fee257" }),
  },
};

export const defaultCustomTheme: Theme = {
  ...darkTheme,
  name: "custom",
};

/** THEMES represent all the themes you define in Themes.tsx */
export const THEMES = {
  [lightTheme.name]: lightTheme,
  [darkTheme.name]: darkTheme,
  [defaultCustomTheme.name]: defaultCustomTheme,
};

export const GlobalReset = () => {
  const theme: Theme = useTheme();

  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          border: 0;
          outline: 0;

          font-family: ${theme.font.family};
          font-size: ${theme.font.size}px;
          font-weight: ${theme.font.weight};
          color: ${theme.colors.onSurface.main};
          -webkit-tap-highlight-color: transparent;

          &::selection {
            background: ${theme.colors.primary.main};
            color: black;
          }
        }

        html {
          /* border: 2px dashed teal; */

          /* width: 100%; */
          /* height: 100%; */
          /* overflow: hidden; */
          /* overflow-y: scroll; */
          /* overflow-x: hidden; */

          /*
            !important is here because we need the scroll bar to always show 
            otherwise there is a jarring jump when users click between pages that may
            or may not have content that overflows.
          
            However, there is some function or library in this project
            that adds overflow: auto to the html element (our viewport scrollbar) which negates
            this rule here.
          */

          overflow: hidden scroll !important;
          scroll-behavior: smooth;

          background-color: ${theme.colors.background.main};

          /* background: ${`linear-gradient(45deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`}; */

          body {
            /* border: 2px dashed salmon; */

            /* overflow: auto; */

            /* overflow: hidden; */
            /* width: 100%; */
            /* height: 100%; */

            #root {
              /* border: 2px dashed orange; */

              /* overflow: hidden; */
              /* overflow: auto; */
              /* width: 100%; */
              /* height: 100%; */

              /* display: flex; */
            }
          }
        }

        a,
        a:link,
        a:visited,
        a:hover,
        a:active {
          cursor: pointer;
          text-decoration: none;
        }

        ul,
        ol {
          list-style-type: none;
        }

        button {
          border: 0;
          cursor: pointer;
        }

        button:active,
        button:focus {
          outline: 0;
        }

        input {
          border: 0;
          outline: 0;
        }
      `}
    />
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;

  /* background-color: ${({ theme }) => theme.colors.primary.main}; */

  display: flex;
`;

const getFontColor = (color: string) =>
  ColorString(color).isDark() ? "#ffffff" : "#000000";

const Column = styled.div`
  flex: 1;
  /* background-color: ${({ theme }) => theme.colors.background.main}; */
  background-color: ${({ c }: { c: string }) => c};
  padding: 1rem;

  display: flex;
  flex-direction: column;

  span {
    color: ${({ c }: { c: string }) => getFontColor(c)};
  }
`;

const ColorName = styled.span`
  width: 100%;
  color: #000;
`;

const ThemePreview = ({ theme }: { theme: Theme }) => {
  return (
    <Container>
      <Column c={theme.colors.background.main}>
        <ColorName>background: {theme.colors.background.main}</ColorName>
      </Column>
      <Column c={theme.colors.surface.main}>
        <ColorName>surface: {theme.colors.surface.main}</ColorName>
      </Column>
      <Column c={theme.colors.onBackground.main}>
        <ColorName>onBackground: {theme.colors.onBackground.main}</ColorName>
      </Column>
      <Column c={theme.colors.onSurface.main}>
        <ColorName>onSurface: {theme.colors.onSurface.main}</ColorName>
      </Column>
    </Container>
  );
};

export default ThemePreview;
