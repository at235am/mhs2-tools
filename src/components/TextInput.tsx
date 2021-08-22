// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

const Container = styled.div``;

const Input = styled.input`
  width: 100%;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.onSurface.main};
`;

type TextInputProps = {
  value: string | number | readonly string[] | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
  spellCheck?: boolean;
};

const TextInput = ({
  value,
  onChange,
  className,
  maxLength,
  disabled = false,
  spellCheck = true,
  placeholder,

  ...props
}: TextInputProps) => {
  return (
    <Input
      {...props}
      className={className}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      disabled={disabled}
      placeholder={placeholder}
      spellCheck={spellCheck}
    />
  );
};

export default TextInput;
