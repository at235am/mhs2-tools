// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import Asset from "./AssetComponents";

// import { ReactComponent as LogoClipSvg } from "../assets/logo-clip.svg";
import { ReactComponent as LogoClipSvg } from "../assets/logo/n-logo-clippable.svg";

import { rainbowGradient } from "./GeneSlot";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useEffect } from "react";
import { rainbowTextGradient } from "../utils/color";

const Container = styled.div`
  position: relative;

  display: flex;

  justify-content: center;
  align-items: center;
`;

const LogoClipContainer = styled(motion.div)`
  position: relative;
  /* border: 1px dashed red; */
  background-image: ${rainbowTextGradient()};
  background-size: 1500%;
  /* background-position: 3%; */

  /* background-attachment: local; */
  /* background-color: white; */
  /* clip-path: circle(20% at 5% 5%) circle(20% at 5% 5%); */

  clip-path: url(#logo-clip);

  height: 100%;
  width: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px;

  height: 3rem;
  width: 3rem;

  /* height: 90%; */
  /* width: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px; */

  /* transform: scale(0.6); */

  display: flex;
`;

const Text = styled.p`
  margin-left: 0.5rem;
  font-weight: 700;
  font-style: italic;
  font-size: 1.5rem;
  text-transform: uppercase;
`;

type LogoProps = {};

const Logo = ({}: LogoProps) => {
  const { scrollYProgress } = useViewportScroll();
  const percentString = useTransform(
    scrollYProgress,
    (latest) => `${Math.floor(latest * 100)}%`
  );

  const percent = useTransform(scrollYProgress, (latest) =>
    Math.floor(latest * 100)
  );

  const rotation = useTransform(percent, [0, 100], [0, 360]);

  useEffect(() => {
    // scrollYProgress.onChange((latest) => {
    //   console.log(latest);
    // });
  }, []);

  return (
    <Container>
      <LogoClipContainer style={{ backgroundPosition: percentString }}>
        <LogoClipSvg />
      </LogoClipContainer>{" "}
      <Text>Navirou</Text>
    </Container>
  );
};

export default Logo;
