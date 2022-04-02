import React from "react";
import { QuizItem } from "../../../types/Quiz";
import { Card, Typography } from "@mui/material";
import Option from "./Option";

interface QuestionProps {
  selectedOptionIDs: string[];
  quizItem: QuizItem;
  onClick: (optionID: string) => void;
}

export default function Question({
  selectedOptionIDs,
  quizItem,
  onClick,
}: QuestionProps) {
  return (
    <Card elevation={2} sx={{ p: 2 }}>
      <Typography sx={{ fontWeight: 500, mb: 1 }}>{quizItem.text}</Typography>
      {quizItem.options?.map((o) => (
        <Option
          key={o.id}
          type={quizItem.type}
          text={o.text}
          selected={selectedOptionIDs.includes(o.id)}
          onClick={() => onClick(o.id)}
        />
      ))}
    </Card>
  );
}
