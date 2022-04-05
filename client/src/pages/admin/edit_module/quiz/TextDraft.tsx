import React from "react";
import QuizItemDraft from "./QuizItemDraft";
import { TextField } from "@mui/material";
import { QuizItem } from "../../../../types/Quiz";

interface TextDraftProps {
  index: number;
  item: QuizItem;
  updateText: (updatedText: QuizItem) => void;
  onRemove: () => void;
}

export default function TextDraft({
  index,
  item,
  updateText,
  onRemove,
}: TextDraftProps) {
  return (
    <QuizItemDraft onRemove={onRemove} index={index} itemId={item.id}>
      <TextField
        multiline
        sx={{ m: 2 }}
        label="Text"
        onChange={(e) => {
          updateText({ ...item, text: e.target.value });
        }}
        value={item.text}
      />
    </QuizItemDraft>
  );
}
