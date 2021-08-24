// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import { BsQuestion } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import { useUIState } from "../contexts/UIContext";
import { BuildMetaInfo } from "../pages/BuildPage";
import DynamicPortal from "./DynamicPortal";
import Gutter from "./Gutter";

// icons:
import { RiInformationFill } from "react-icons/ri";

const NotificationContainer = styled(motion.div)`
  /* overflow: hidden; */
  position: relative;

  /* margin-top: 1rem; */
  /* padding: 0.5rem 0; */
  /* min-height: 3.5rem; */
  border-radius: 5px;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  padding: 1rem;

  background-color: #222222;

  svg {
    /* position: absolute; */
    /* left: 0; */

    /* margin-left: 1rem; */

    @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
      margin-left: 0.75rem;
    }

    width: 1.5rem;
    height: 1.5rem;

    path:nth-of-type(2) {
      fill: white;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    padding-bottom: 2rem;
    padding-top: 2rem;
    gap: 2rem;
  }
`;

const Content = styled.div`
  /* border: 1px solid red; */
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    gap: 1rem;
  }
`;

const NotificationText = styled.p`
  color: white;
  /* margin: 0.5rem; */

  font-weight: 600;

  white-space: nowrap;
`;

const EditButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;

  background-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: 5px;

  text-transform: uppercase;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.darker};

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 1rem;
  }
`;

type Props = { metaInfo: BuildMetaInfo; editButtonAction: () => void };

const BuildPageNotification = ({ metaInfo, editButtonAction }: Props) => {
  const { isMobile } = useUIState();

  // if (isMobile)
  //   return (
  //     <NotificationContainer>
  //       <RiInformationFill />
  //       <NotificationText>
  //         You are viewing someone else's build.
  //       </NotificationText>
  //       <NotificationText>To edit, fork your own copy.</NotificationText>
  //     </NotificationContainer>
  //   );

  return (
    <NotificationContainer>
      <RiInformationFill />
      <Content>
        <NotificationText>
          You are viewing someone else's build.
        </NotificationText>
        <NotificationText> To edit, fork your own copy.</NotificationText>
        <EditButton type="button" onClick={editButtonAction}>
          Edit{" ->"}
        </EditButton>
      </Content>
    </NotificationContainer>
  );
};

export default BuildPageNotification;
