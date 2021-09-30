import React from "react";
import QuizItemDraft from "./QuizItemDraft";
import { TextField } from "@mui/material";
import { Text } from "../../../types/Quiz";

interface TextDraftProps {
  index: number;
  text: Text;
  updateText: (updatedText: Text) => void;
  onRemove: () => void;
}

export default function TextDraft({
  index,
  text,
  updateText,
  onRemove,
}: TextDraftProps) {
  return (
    <QuizItemDraft onRemove={onRemove} index={index} itemId={text.id}>
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
