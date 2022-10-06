import React from "react";
import { Module, QuizItem, QuizItemType } from "../../../types/Quiz";
import { useImmer } from "use-immer";
import { Button, Stack, Typography } from "@mui/material";
import Question from "./Question";
import styled, { css } from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import { GET_CURRENT_USER } from "../../../common/CurrentUserProvider";

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

export type AnswerSheet = { itemID: string; optionIDs: string[] }[];

const SUBMIT_MODULE = gql`
  mutation SubmitModule($moduleID: ID!, $answerSheet: [AnswerInput]) {
    submitModule(moduleID: $moduleID, answerSheet: $answerSheet)
  }
`;

interface QuizTakerProps {
  module: Module;
}

export default function QuizTaker({ module }: QuizTakerProps) {
  const initialAnswerSheet = module.quiz
    .filter(
      (item) =>
        item.type === QuizItemType.MultipleChoice ||
        item.type === QuizItemType.Checkboxes
    )
    .map((item) => ({ itemID: item.id, optionIDs: [] }));

  const [answerSheet, setAnswerSheet] =
    useImmer<AnswerSheet>(initialAnswerSheet);

  const [submitModule, result] = useMutation(SUBMIT_MODULE, {
    variables: { moduleID: module.id, answerSheet },
    refetchQueries: [
      {query: GET_CURRENT_USER}
    ]
  });

  const selectMultipleChoiceOption = (itemID: string, optionID: string) =>
    setAnswerSheet((draft) => {
      const index = draft.findIndex((i) => i.itemID === itemID);
      draft[index].optionIDs = [optionID];
    });

  const toggleCheckboxOption = (itemID: string, optionID: string) =>
    setAnswerSheet((draft) => {
      const itemIndex = draft.findIndex((i) => i.itemID === itemID);

      const optionIndex = draft[itemIndex].optionIDs.findIndex(
        (o) => o === optionID
      );

      optionIndex === -1
        ? draft[itemIndex].optionIDs.push(optionID)
        : draft[itemIndex].optionIDs.splice(optionIndex, 1);
    });

  return (
    <Stack spacing={4}>
      {module.quiz.map((quizItem) => {
        const selectedOptionIDs =
          answerSheet.find((qi) => qi.itemID === quizItem.id)?.optionIDs ?? [];

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

      <LoadingButton
        loading={result.loading}
        variant="contained"
        sx={{ alignSelf: "flex-end" }}
        onClick={() => submitModule()}
      >
        Submit
      </LoadingButton>
    </Stack>
  );
}
