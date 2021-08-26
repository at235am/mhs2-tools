// styling:
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { darkGradientString, lightGradientString } from "../utils/color";
import color from "color";

import { RiInformationFill } from "react-icons/ri";

const Container = styled.div<{ bgColor: string }>`
  padding: 1rem;
  padding-right: 2rem;
  width: 100%;
  height: min-content;

  border-radius: 1rem;
  border-radius: 5px;

  border-radius: 5px 3rem 3rem 3rem;

  overflow: hidden;

  background-color: ${({ bgColor }) => bgColor};

  display: flex;
  gap: 1rem;
`;

const Title = styled.p<{ textColor: string; bgColor: string }>`
  font-weight: 700;
  font-size: 1rem;

  text-transform: uppercase;
  color: ${({ textColor }) => textColor};

  display: flex;
  align-items: center;
`;

const Text = styled.p<{ textColor: string; bgColor: string }>`
  letter-spacing: 1px;
  font-weight: 600;
  font-size: 0.9rem;

  padding: 0.75rem;

  border-radius: 3px 3px 2rem 3px;

  background-color: ${({ bgColor }) => bgColor};
  color: ${({ textColor }) => textColor};
`;

const IconSlot = styled.span<{
  iconColor: string;
  iconSize: number;
  bgColor: string;
}>`
  display: flex;
  justify-content: center;

  ${({ iconColor, iconSize }) => css`
    svg {
      width: ${iconSize}px;
      height: ${iconSize}px;

      path {
        color: ${iconColor};
      }
    }
  `}
`;

const TextSlot = styled.span`
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

type DialogProps = {
  type?: "normal" | "invert" | "info" | "success" | "caution" | "danger";
  title: string;
  text?: string;
  iconSize?: number;

  className?: string;
};

const Dialog = ({
  title,
  text,
  type = "normal",
  iconSize = 24,
  ...props
}: DialogProps) => {
  const theme = useTheme();

  const colors = {
    normal: theme.colors.surface.darker,
    invert: theme.colors.onSurface.main,
    info: theme.colors.info.main,
    success: theme.colors.success.main,
    caution: theme.colors.caution.main,
    danger: theme.colors.danger.main,
  };

  const mainColor = colors[type];

  let bgColor = mainColor;
  let titleColor = color(mainColor).darken(0.5).hex();
  let textColor = color(mainColor).lighten(1).hex();
  let iconColor = "white";
  let textBg = color(mainColor).darken(0.1).hex();

  if (type === "normal" || type === "invert") {
    textColor = color(mainColor).isDark() ? "#fff" : "#222";
    titleColor = textColor;
    iconColor = textColor;
  }

  return (
    <Container {...props} bgColor={bgColor}>
      <IconSlot iconSize={iconSize} iconColor={iconColor} bgColor={bgColor}>
        <RiInformationFill />
      </IconSlot>
      <TextSlot>
        <Title textColor={titleColor} bgColor={bgColor}>
          {title}
        </Title>
        <Text textColor={textColor} bgColor={textBg}>
          {text}
        </Text>
      </TextSlot>
    </Container>
  );
};

export default Dialog;
