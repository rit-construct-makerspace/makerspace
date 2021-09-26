import React from "react";
import QuizItemDraft from "./QuizItemDraft";
import { TextField } from "@mui/material";
import { Text } from "../../../types/Quiz";

interface TextDraftProps {
  text: Text;
  updateText: (updatedText: Text) => void;
  onRemove: () => void;
}

export default function TextDraft({
  text,
  updateText,
  onRemove,
}: TextDraftProps) {
  return (
    <QuizItemDraft onRemove={onRemove}>
      <TextField
        multiline
        sx={{ m: 2 }}
        label="Text"
        onChange={(e) => {
          updateText({ ...text, text: e.target.value });
        }}
        value={text.text}
      />
    </QuizItemDraft>
  );
}
