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

  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

type Props = {
  titleLabel: string | ReactElement;
  children: ReactElement | ReactElement[] | string | null;
  onClick?: () => void;
};

const BPHTemplate = ({ children, titleLabel, onClick }: Props) => {
  return (
    <HeaderItem onClick={onClick}>
      <HeaderLabel>{titleLabel}</HeaderLabel>
      {children}
    </HeaderItem>
  );
};

export default BPHTemplate;
