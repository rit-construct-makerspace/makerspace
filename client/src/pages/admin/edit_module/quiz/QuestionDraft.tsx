import React from "react";
import {
  Button,
  CardContent,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import {
  ModuleItem,
  ModuleItemType,
  QuestionOption,
} from "../../../../types/Module";
import QuestionOptionDraft from "./QuestionOptionDraft";
import ModuleItemDraft from "./ModuleItemDraft";
import useTimedState from "../../../../hooks/useTimedState";

interface QuestionDraftProps {
  index: number;
  moduleItem: ModuleItem;
  updateModuleItem: (text: string, type: ModuleItemType) => void;
  deleteModuleItem: () => void;
  addOption: () => void;
  updateOption: (optionId: number, text: string, correct: boolean) => void;
  deleteOption: (optionId: number) => void;
}

export default function QuestionDraft({
  index,
  moduleItem,
  updateModuleItem,
  deleteModuleItem,
  addOption,
  updateOption,
  deleteOption,
}: QuestionDraftProps) {
  const [questionText, setQuestionText] = useTimedState(
    moduleItem.text,
    (latestText) => updateModuleItem(latestText, moduleItem.type)
  );

  return (
    <ModuleItemDraft
      index={index}
      itemId={moduleItem.id}
      onRemove={deleteModuleItem}
      extraActions={
        <Select
          value={moduleItem.type}
          size="small"
          sx={{ ml: "auto", mr: 1, width: 160 }}
          onChange={(e) =>
            updateModuleItem(questionText, e.target.value as ModuleItemType)
          }
        >
          <MenuItem value={ModuleItemType.MultipleChoice}>
            Multiple choice
          </MenuItem>
          <MenuItem value={ModuleItemType.Checkboxes}>Checkboxes</MenuItem>
        </Select>
      }
    >
      <CardContent>
        <TextField
          id="outlined-basic"
          label="Question title"
          fullWidth
          variant="outlined"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </CardContent>

      <Stack spacing={1} px={1}>
        {moduleItem.options.map((option: QuestionOption) => (
          <QuestionOptionDraft
            key={option.id}
            moduleItemType={moduleItem.type}
            option={option}
            onRemove={() => deleteOption(option.id)}
            onTextChange={(updatedText) =>
              updateOption(option.id, updatedText, option.correct)
            }
            onToggleCorrect={() =>
              updateOption(option.id, option.text, !option.correct)
            }
          />
        ))}

        <Button sx={{ mx: 1 }} onClick={addOption}>
          + Add option
        </Button>
      </Stack>
    </ModuleItemDraft>
  );
}
