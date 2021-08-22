// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement } from "react";

const HeaderItem = styled.div`
  position: relative;

  padding: 1rem 1.5rem;
  min-height: 9rem;

  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.surface.main};

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderLabel = styled.h2`
  /* border: 1px dashed; */

  font-size: 1rem;
  font-weight: 700;
`;

type Props = {
  titleLabel: string;
  children: ReactElement | ReactElement[] | string | null;
};

const BPHTemplate = ({ children, titleLabel }: Props) => {
  return (
    <HeaderItem>
      <HeaderLabel>{titleLabel}</HeaderLabel>
      {children}
    </HeaderItem>
  );
};

export default BPHTemplate;
