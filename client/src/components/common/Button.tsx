import React from "react";
import Styles from "../../Styles";
import styled from "styled-components";

const StyledButton = styled.button`
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  border: none;
  border-radius: 0;
  padding: 10px 20px;
  color: ${Styles.Colors.White};
  ${Styles.Shadows.SmallOutset}

  &:disabled {
    background-color: ${Styles.Colors.DarkGray};
    cursor: default;
  }
`;

interface ButtonProps {
  label: string;
  className?: string;
  onClick: () => any;
  disabled?: boolean;
}

function Button({ label, className, onClick, disabled = false }: ButtonProps) {
  return (
    <StyledButton
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </StyledButton>
  );
}

export const NormalButton = styled(Button)`
  background-color: ${Styles.Colors.Orange};
`;

export const DestructiveButton = styled(Button)`
  background-color: ${Styles.Colors.Red};
`;
