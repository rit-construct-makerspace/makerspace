import React from "react";
import Styles from "../../Styles";
import styled, { css, FlattenInterpolation } from "styled-components";

export enum ButtonType {
  Normal,
  Destructive,
}

const ButtonTypeStyleMap: { [key in ButtonType]: FlattenInterpolation<any> } = {
  [ButtonType.Normal]: css`
    background-color: ${Styles.Colors.Orange};
  `,
  [ButtonType.Destructive]: css`
    background-color: ${Styles.Colors.Red};
  `,
};

const DisabledExtraStyles = css`
  background-color: ${Styles.Colors.DarkGray};
  cursor: default;
`;

interface StyledButtonProps {
  $extraStyles: FlattenInterpolation<any>;
}

const StyledButton = styled.button<StyledButtonProps>`
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  border: none;
  border-radius: 0;
  padding: 10px 20px;
  letter-spacing: 0.5px;
  color: ${Styles.Colors.White};
  ${Styles.Shadows.SmallOutset}
  ${(props) => props.$extraStyles}
`;

interface ButtonProps {
  label: string;
  onClick: () => any;
  buttonType?: ButtonType;
  disabled?: boolean;
}

export default function Button({
  label,
  onClick,
  buttonType = ButtonType.Normal,
  disabled = false,
}: ButtonProps) {
  const extraStyles = disabled
    ? DisabledExtraStyles
    : ButtonTypeStyleMap[buttonType];

  return (
    <StyledButton
      type="button"
      $extraStyles={extraStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </StyledButton>
  );
}
