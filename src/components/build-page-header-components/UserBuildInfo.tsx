// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import TextInput from "../TextInput";
import BPHTemplate from "./BuildPageHeaderTemplate";

import { rainbowTextGradient } from "../../utils/color";

const BuildNameInput = styled(TextInput)`
  /* border: 1px dashed; */

  font-size: 2rem;
  font-weight: 700;

  height: 100%;

  text-align: center;

  color: ${({ theme }) => theme.colors.primary.main};

  /* background: ${rainbowTextGradient()};
  background-attachment: fixed;
  background-clip: text;
  -webkit-text-fill-color: transparent; */

  &::placeholder {
    color: ${({ theme }) => theme.colors.error.dark};
    text-align: center;
    opacity: 1;
  }
`;

const CreatorName = styled.p`
  /* border: 1px dashed; */

  font-style: italic;
  font-size: 1.15rem;
  font-weight: 600;
  flex: 1;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

type Props = {
  buildName: string;
  setBuildName: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  disabled: boolean;
};

const UserBuildInfo = ({
  buildName,
  setBuildName,
  username,
  disabled = false,
}: Props) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuildName(event.target.value);
  };
  return (
    <BPHTemplate titleLabel="Build">
      <BuildNameInput
        value={buildName}
        onChange={onChange}
        maxLength={30}
        placeholder="Untitled"
        // disabled={!buildMetaData.isCreator}
        disabled={disabled}
        // spellcheck={false}
        spellCheck={false}
      />
      <CreatorName>
        {"by "}
        {username}
      </CreatorName>
    </BPHTemplate>
  );
};

export default UserBuildInfo;