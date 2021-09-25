import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Question, QuestionType } from "../../../types/Quiz";
import OptionDraft from "./OptionDraft";

interface QuestionDraftProps {
  question: Question;
  removeQuestion: (id: string) => void;
  setQuestionTitle: (id: string, title: string) => void;
  setQuestionType: (id: string, questionType: QuestionType) => void;
  addOption: (id: string) => void;
  removeOption: (questionId: string, optionId: string) => void;
  setOptionText: (questionId: string, optionId: string, text: string) => void;
  toggleOptionCorrect: (questionId: string, optionId: string) => void;
}

export default function QuestionDraft({
  question,
  removeQuestion,
  setQuestionTitle,
  setQuestionType,
  addOption,
  removeOption,
  setOptionText,
  toggleOptionCorrect,
}: QuestionDraftProps) {
  return (
    <Card elevation={2} sx={{ width: 600 }}>
      <CardContent>
        <TextField
          id="outlined-basic"
          label="Question title"
          fullWidth
          variant="outlined"
          value={question.title}
          onChange={(event) =>
            setQuestionTitle(question.id, event.target.value)
          }
        />
      </CardContent>

      <Stack spacing={1} px={1}>
        {question.options.map((option) => (
          <OptionDraft
            key={option.id}
            questionType={question.questionType}
            option={option}
            onRemove={() => removeOption(question.id, option.id)}
            onTextChange={(e) =>
              setOptionText(question.id, option.id, e.target.value)
            }
            onToggleCorrect={() => toggleOptionCorrect(question.id, option.id)}
          />
        ))}

        <Button onClick={() => addOption(question.id)}>+ Add option</Button>
      </Stack>

      <CardActions>
        <IconButton aria-label="Move up">
          <ArrowDownwardIcon />
        </IconButton>

        <IconButton aria-label="Move down">
          <ArrowUpwardIcon />
        </IconButton>

        <IconButton aria-label="Delete">
          <DeleteIcon onClick={() => removeQuestion(question.id)} />
        </IconButton>

        <Select
          value={question.questionType}
          size="small"
          sx={{ ml: "auto", width: 160 }}
          onChange={(e) => {
            // @ts-ignore idk how to convince TS that `value` is a `QuestionType`
            setQuestionType(question.id, e.target.value);
          }}
        >
          <MenuItem value={QuestionType.MultipleChoice}>
            Multiple choice
          </MenuItem>
          <MenuItem value={QuestionType.Checkboxes}>Checkboxes</MenuItem>
        </Select>
      </CardActions>
    </Card>
  );
}
