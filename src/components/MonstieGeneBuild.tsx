// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { GeneSkill } from "../utils/ProjectTypes";
import { encodeGeneBuildToBase64Url } from "../utils/utils";
import { MdShare } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

const Container = styled.li`
  position: relative;

  /* padding: 1rem; */
  border-radius: 5px;
  min-height: 15rem;
  background-color: ${({ theme }) => theme.colors.surface.main};

  display: flex;
  flex-direction: column;
`;

const P = styled.span`
  color: red;
`;

const CardLink = styled(Link)`
  /* border: 1px dashed; */

  position: absolute;

  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;

  width: 100%;

  display: flex;
  /* border: 1px dashed; */
`;

const ShareButton = styled.button`
  /* position: absolute; */

  /* bottom: 0; */
  /* right: 0; */
  margin: 1rem;

  height: 3rem;
  width: 3rem;

  svg {
    width: 60%;
    height: 60%;
  }

  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.surface.dark};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditLinkButton = styled(Link)`
  margin: 1rem;

  height: 3rem;
  width: 3rem;
`;

export type GeneBuild = {
  buildId: string;
  buildName: string;
  monstie: number;
  createdBy: string | null;
  geneBuild: GeneSkill[];
  insights: string;
};

type MonstieGeneBuildProps = { build: GeneBuild };

const MonstieGeneBuild = ({ build }: MonstieGeneBuildProps) => {
  const { user } = useAuth();
  const { buildId, buildName, monstie, createdBy, geneBuild } = build;
  const encodedUrl = encodeGeneBuildToBase64Url(build);

  const url = user ? buildId : encodedUrl;

  return (
    <Container>
      <CardLink to={`/builds/${buildId}`}>
        <P>{buildName ? buildName : "Untitled"}</P>
      </CardLink>

      <ButtonContainer>
        <ShareButton
          onClick={() => {
            console.log(url);
          }}
        >
          <MdShare />
        </ShareButton>
      </ButtonContainer>
    </Container>
  );
};

export default MonstieGeneBuild;
