import React, { ChangeEventHandler } from "react";
import { IconButton, Stack, TextField } from "@mui/material";
import { Option, QuestionType } from "../../../../types/Quiz";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface OptionDraftProps {
  questionType: QuestionType;
  option: Option;
  onRemove: () => void;
  onTextChange: ChangeEventHandler<HTMLInputElement>;
  onToggleCorrect: () => void;
}

function getCorrectIcon(questionType: QuestionType, correct: boolean) {
  if (questionType === QuestionType.MultipleChoice) {
    return correct ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />;
  }

  if (questionType === QuestionType.Checkboxes) {
    return correct ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />;
  }
}

export default function OptionDraft({
  questionType,
  option,
  onRemove,
  onTextChange,
  onToggleCorrect,
}: OptionDraftProps) {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" onClick={onToggleCorrect}>
        {getCorrectIcon(questionType, option.correct)}
      </IconButton>

      <TextField
        id="outlined-basic"
        fullWidth
        variant="standard"
        size="small"
        placeholder="Enter option text"
        value={option.text}
        onChange={onTextChange}
        sx={{ mx: 1 }}
      />

      <IconButton size="small" onClick={onRemove}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
