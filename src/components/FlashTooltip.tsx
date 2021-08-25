// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Wrapper = styled.div<{ text: string }>`
  opacity: ${({ text }) => (text === "" ? 0 : 1)};

  position: absolute;
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
`;

const Container = styled(motion.p)`
  z-index: 200;
  position: absolute;
  top: -23rem;
  left: 50%;

  box-shadow: 0px 0px 20px -13px green;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);

  border-radius: 5px;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.onPrimary.main};
  /* right: 0; */

  /* transform: translateX(-50%); */

  padding: 0.25rem 1rem;

  background-color: ${({ theme }) => theme.colors.danger.dark};
`;

type FlashTooltipProps = {
  text: string;
  delay?: number;
};

const FlashTooltip = ({ text, delay = 2500 }: FlashTooltipProps) => {
  const [show, setShow] = useState(true);
  const time = useRef<NodeJS.Timeout>(setTimeout(() => {}, 0));

  const animationProps = {
    variants: {
      appear: { y: 0, x: "-50%" },
      outOfView: { y: 500, x: "-50%" },
      // exit: { backgroundColor: "blue" },
    },
    initial: "appear",
    animate: show ? "appear" : "outOfView",
    // exit: "exit",
  };

  useEffect(() => {
    return () => clearTimeout(time.current);
  }, []);

  useEffect(() => {
    setShow(true);
  }, [text]);

  useEffect(() => {
    if (show) {
      clearTimeout(time.current);
      time.current = setTimeout(() => setShow(false), delay);
    }
  }, [text, show]);

  return (
    <Wrapper text={text}>
      <Container {...animationProps}>{text}</Container>
    </Wrapper>
  );
};

export default FlashTooltip;
