import React from "react";
import { QuizItem, QuizItemType } from "../../../types/Quiz";
import { useImmer } from "use-immer";
import { Button, Stack, Typography } from "@mui/material";
import Question from "./Question";
import styled, { css } from "styled-components";

const elevationTwoShadow = css`
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
`;

const StyledImageEmbed = styled.img`
  border-radius: 4px;
  align-self: center;
  max-width: 800px;
  max-height: 800px;
  ${elevationTwoShadow}
`;

const StyledIFrame = styled.iframe`
  border-radius: 4px;
  align-self: stretch;
  border: none;
  height: 450px;
  ${elevationTwoShadow}
`;

export type AnswerSheet = { id: string; optionIDs: string[] }[];

interface QuizTakerProps {
  quiz: QuizItem[];
}

export default function QuizTaker({ quiz }: QuizTakerProps) {
  const initialAnswerSheet = quiz
    .filter(
      (item) =>
        item.type === QuizItemType.MultipleChoice ||
        item.type === QuizItemType.Checkboxes
    )
    .map((item) => ({ id: item.id, optionIDs: [] }));

  const [answerSheet, setAnswerSheet] =
    useImmer<AnswerSheet>(initialAnswerSheet);

  const selectMultipleChoiceOption = (itemID: string, optionID: string) =>
    setAnswerSheet((draft) => {
      const index = draft.findIndex((i) => i.id === itemID);
      draft[index].optionIDs = [optionID];
    });

  const toggleCheckboxOption = (itemID: string, optionID: string) =>
    setAnswerSheet((draft) => {
      const itemIndex = draft.findIndex((i) => i.id === itemID);

      const optionIndex = draft[itemIndex].optionIDs.findIndex(
        (o) => o === optionID
      );

      optionIndex === -1
        ? draft[itemIndex].optionIDs.push(optionID)
        : draft[itemIndex].optionIDs.splice(optionIndex, 1);
    });

  return (
    <Stack spacing={4}>
      {quiz.map((quizItem) => {
        const selectedOptionIDs =
          answerSheet.find((qi) => qi.id === quizItem.id)?.optionIDs ?? [];

        switch (quizItem.type) {
          case QuizItemType.Text:
            return <Typography key={quizItem.id}>{quizItem.text}</Typography>;
          case QuizItemType.MultipleChoice:
            return (
              <Question
                selectedOptionIDs={selectedOptionIDs}
                key={quizItem.id}
                quizItem={quizItem}
                onClick={(optionID) =>
                  selectMultipleChoiceOption(quizItem.id, optionID)
                }
              />
            );
          case QuizItemType.Checkboxes:
            return (
              <Question
                selectedOptionIDs={selectedOptionIDs}
                key={quizItem.id}
                quizItem={quizItem}
                onClick={(optionID) =>
                  toggleCheckboxOption(quizItem.id, optionID)
                }
              />
            );
          case QuizItemType.ImageEmbed:
            return (
              <StyledImageEmbed key={quizItem.id} alt="" src={quizItem.text} />
            );
          case QuizItemType.YoutubeEmbed:
            return (
              <StyledIFrame
                key={quizItem.id}
                src={`https://www.youtube.com/embed/${quizItem.text}`}
              />
            );
        }
      })}

      <Button variant="contained" sx={{ alignSelf: "flex-end" }}>
        Submit
      </Button>
    </Stack>
  );
}
