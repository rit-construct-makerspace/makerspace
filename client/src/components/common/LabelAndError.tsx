import React, { ReactNode } from "react";
import styled from "styled-components";
import Styles from "../../Styles";
import ErrorIcon from "../../assets/images/ErrorIcon.svg";

const StyledDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;

  label {
    font-weight: 300;
    color: ${Styles.Colors.DarkGray};
    margin-bottom: 4px;
  }

  .error {
    margin-top: 8px;
    color: ${Styles.Colors.Red};
    display: flex;
    align-items: center;

    img {
      margin-right: 4px;
      width: 20px;
      height: 20px;
    }
  }
`;

interface LabelAndErrorProps {
  label: string;
  htmlId: string;
  error?: string | undefined;
  children: ReactNode;
}

export default function LabelAndError({
  label,
  htmlId,
  error,
  children,
}: LabelAndErrorProps) {
  return (
    <StyledDiv>
      <label htmlFor={htmlId}>{label}</label>
      {children}
      {error && (
        <div className="error">
          <img src={ErrorIcon} alt="" />
          {error}
        </div>
      )}
    </StyledDiv>
  );
}
