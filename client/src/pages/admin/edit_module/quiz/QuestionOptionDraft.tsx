import React from "react";
import { IconButton, Stack, TextField } from "@mui/material";
import { ModuleItemType, QuestionOption } from "../../../../types/Module";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import useTimedState from "../../../../hooks/useTimedState";

interface OptionDraftProps {
  moduleItemType: ModuleItemType;
  option: QuestionOption;
  onRemove: () => void;
  onTextChange: (updatedText: string) => void;
  onToggleCorrect: () => void;
}

// Returns a circle for multiple choice, and a square for checkbox questions
function getCorrectIcon(moduleItemType: ModuleItemType, correct: boolean) {
  if (moduleItemType === ModuleItemType.MultipleChoice) {
    return correct ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />;
  }

  if (moduleItemType === ModuleItemType.Checkboxes) {
    return correct ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />;
  }
}

export default function QuestionOptionDraft({
  moduleItemType,
  option,
  onRemove,
  onTextChange,
  onToggleCorrect,
}: OptionDraftProps) {
  const [text, setText] = useTimedState<string>(option.text, (latestText) =>
    onTextChange(latestText)
  );

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" onClick={onToggleCorrect}>
        {getCorrectIcon(moduleItemType, option.correct)}
      </IconButton>

      <TextField
        id="outlined-basic"
        fullWidth
        variant="standard"
        size="small"
        placeholder="Enter option text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mx: 1 }}
      />

      <IconButton size="small" onClick={onRemove}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
