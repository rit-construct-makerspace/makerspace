import React, { ChangeEventHandler } from "react";
import styled from "styled-components";
import LabelAndError from "./LabelAndError";
import Styles from "../../Styles";

const StyledInput = styled.input`
  font-size: 16px;
  padding: 8px;
  border-radius: 0;
  border: 1px solid ${Styles.Colors.MediumGray};
  ${Styles.Shadows.SmallOutset};
`;

interface TextFieldProps {
  label: string;
  placeholder?: string;
  error?: string | undefined;
  value: string | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
  id: string;
  className?: string;
}

export default function TextField({
  label,
  placeholder,
  error,
  value,
  onChange,
  id,
  className,
}: TextFieldProps) {
  return (
    <LabelAndError label={label} htmlId={id} error={error}>
      <StyledInput
        type="text"
        id={id}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </LabelAndError>
  );
}
