/**
 * This component was made with recommendations from https://inclusive-components.design/tooltips-toggletips/
 * for accessibility.
 */

// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { ReactElement, useState } from "react";

import { RiInformationFill } from "react-icons/ri";

const Container = styled.span`
  z-index: 100;
  position: relative;

  display: inline-block;
`;

const IconButton = styled.button<{ iconSize: number }>`
  /* border: 1px dashed blue; */

  background-color: transparent;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: ${({ iconSize }) => iconSize}px;
    height: ${({ iconSize }) => iconSize}px;
  }
`;

const LiveRegionARIA = styled.span`
  position: absolute;
  top: 100%;
  left: 50%;

  display: flex;
`;

const TextBubble = styled.span<{ width: number | undefined }>`
  position: relative;

  padding: 1rem;

  min-width: min-content;
  width: ${({ width }) => (width ? `${width}px` : "auto")};
  max-width: 100vw;

  background-color: black;
  color: white;
  font-weight: 600;

  /* border: 1px solid red; */

  border-radius: 5px;

  transform: translate3d(-50%, 10px, 0);
`;

const Arrow = styled.div`
  position: absolute;
  /* top: -8px;
  left: 0;
  width: 100%;
  height: 8px;
  clip-path: polygon(50% 0%, 60% 100%, 100% 100%, 0 100%, 40% 100%); */

  top: -8px;
  left: 50%;
  width: 16px;
  height: 8px;
  clip-path: polygon(50% 0%, 0 100%, 100% 100%);
  transform: translateX(-50%);

  background-color: inherit;
`;

type TooltipsProps = {
  icon?: ReactElement;
  iconSize?: number;
  text: string;
  label: string;
  textBubbleWidth?: number;
};

const Tooltip = ({
  icon,
  iconSize = 28,
  text,
  label,
  textBubbleWidth,
}: TooltipsProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);

  // focusButton() is needed to ensure that certain browsers focus a button upon a tap or click
  // safari iOS does not trigger a focus when a button is clicked/tapped
  const focusButton = () => buttonRef.current?.focus();
  const blurButton = () => buttonRef.current?.blur();
  const showTooltip = () => setShow(true);
  const hideTooltip = () => setShow(false);

  return (
    <Container>
      <IconButton
        ref={buttonRef}
        type="button"
        aria-label={label}
        data-toggletip-content={text}
        iconSize={iconSize}
        onClick={focusButton}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {icon ? icon : <RiInformationFill />}
      </IconButton>

      <LiveRegionARIA role="status">
        {show && (
          <TextBubble width={textBubbleWidth}>
            {text} <Arrow />
          </TextBubble>
        )}
      </LiveRegionARIA>
    </Container>
  );
};

export default Tooltip;
