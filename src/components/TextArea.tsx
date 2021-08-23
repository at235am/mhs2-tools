// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useLayoutEffect, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";

const Container = styled.div`
  position: relative;
`;

const TextAreaContainer = styled.textarea`
  z-index: 5;

  overflow: hidden;
  resize: none;
  width: 100%;
  min-height: 10rem;

  padding: 2rem;

  color: ${({ theme }) => theme.colors.onSurface.main};

  border-radius: 1rem;

  background-color: ${({ theme }) => theme.colors.surface.main};

  &::placeholder {
    font-style: italic;
    color: ${({ theme }) => theme.colors.onSurface.main};
    opacity: 0.5;
    /* font-weight: 600; */
  }
`;

const DummyMeasurementTA = styled(TextAreaContainer)`
  z-index: -1;

  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;

  background-color: red;
  color: blue;
`;

const CharCounter = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
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

      console.log(textHeight);
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
      <DummyMeasurementTA ref={textMeasurementRef} value={value} readOnly />
      <CharCounter>
        {value.length}/{maxLength}
      </CharCounter>
    </Container>
  );
};

export default TextArea;
