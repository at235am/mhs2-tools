// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useLayoutEffect, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";

const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  /* &::before {
    z-index: 10;
    position: relative;
    content: "";
    top: 1px;

    background-color: ${({ theme }) => theme.colors.surface.main};
    max-width: 2rem;
    min-height: 2rem;

    border-left: 2px solid ${({ theme }) => theme.colors.surface.darker};

    clip-path: polygon(100% 0, 0 100%, 100% 100%);
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    clip-path: polygon(0 0, 0 100%, 100% 100%);

    box-shadow: 2px -4px 0px 0px ${({ theme }) => theme.colors.surface.darker};
    box-shadow: 2px -4px 0px 0px red;
  } */
`;

const TextAreaContainer = styled.textarea`
  z-index: 5;

  overflow: hidden;
  resize: none;
  width: 100%;
  min-height: 10rem;

  padding: 2rem;

  color: ${({ theme }) => theme.colors.onSurface.main};

  border-radius: 5px;
  border-radius: 1rem;
  border-radius: 5px 3rem 3rem 3rem;

  background-color: ${({ theme }) => theme.colors.surface.lighter};

  font-size: 1rem;
  letter-spacing: 1px;

  /* border: 1px solid ${({ theme }) => theme.colors.surface.darker}; */

  /* border-top-left-radius: 0; */
  /* border: 2px solid ${({ theme }) => theme.colors.surface.darker}; */
  /* border-top: none; */

  /* box-shadow: 2px -2px 0px 0px ${({ theme }) =>
    theme.colors.surface.darker}; */
  /* box-shadow: 0px -2px 0px 0px ${({ theme }) =>
    theme.colors.surface.darker}; */

  &::placeholder {
    font-size: 0.9rem;
    font-weight: normal;
    letter-spacing: 0;

    font-style: italic;
    color: ${({ theme }) => theme.colors.onSurface.main};
    opacity: 0.5;
    /* font-weight: 600; */
  }

  &:disabled {
    cursor: text;
  }
`;

const DummyMeasurementTA = styled(TextAreaContainer)`
  z-index: -1;

  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
`;

const CharCounter = styled.div`
  z-index: 20;

  position: absolute;
  bottom: 0;
  right: 1rem;
  letter-spacing: 1px;

  margin: 1rem;

  font-size: 0.8rem;
  font-weight: 600;
`;

type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
};

const TextArea = ({ value, setValue, maxLength = 10000, ...props }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textMeasurementRef = useRef<HTMLTextAreaElement>(null);
  const { width = 0 } = useResizeObserver({ ref: textMeasurementRef });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value);

  useEffect(() => {
    if (textAreaRef.current && textMeasurementRef.current) {
      const textHeight = `${textMeasurementRef.current.scrollHeight}px`;
      textAreaRef.current.style.height = textHeight;
    }
  }, [value, width]);

  return (
    <Container>
      <TextAreaContainer
        {...props}
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
      />

      {/* <label htmlFor="ignore">First name:</label> */}
      <DummyMeasurementTA
        id="ignore"
        ref={textMeasurementRef}
        value={value}
        readOnly
        placeholder="ignore"
      />

      <CharCounter>
        {value.length}/{maxLength}
      </CharCounter>
    </Container>
  );
};

export default TextArea;
