import React from "react";
import Page from "../../Page";
import { Button, Stack } from "@mui/material";
import QuestionDraft from "./QuestionDraft";
import { Option, Question, QuestionType, Quiz } from "../../../types/Quiz";
import { v4 as uuidv4 } from "uuid";
import { useImmer } from "use-immer";

interface QuizBuilderPageProps {}

function getQuestionIndex(draft: Quiz, questionId: string): number {
  return draft.questions.findIndex((q) => q.id === questionId);
}

function getQuestion(draft: Quiz, questionId: string): Question {
  const index = getQuestionIndex(draft, questionId);
  return draft.questions[index];
}

function getOptionIndex(question: Question, optionId: string) {
  return question.options.findIndex((o) => o.id === optionId);
}

function getOption(question: Question, optionId: string) {
  const index = getOptionIndex(question, optionId);
  return question.options[index];
}

// When switching from a checkboxes to multiple choice, we need to make sure
// we aren't left with multiple correct options (there should only be one)
function getAdjustedOptions(questionType: QuestionType, options: Option[]) {
  if (questionType === QuestionType.Checkboxes) {
    return options;
  }

  const firstCorrectOptionIndex = options.findIndex((o) => o.correct);
  return options.map((option, index) => ({
    ...option,
    correct: index === firstCorrectOptionIndex,
  }));
}

export default function QuizBuilderPage({}: QuizBuilderPageProps) {
  const [quiz, setQuiz] = useImmer<Quiz>({
    id: uuidv4(),
    items: [],
  });

  const addQuestion = () =>
    setQuiz((draft) => {
      draft.questions.push({
        id: uuidv4(),
        title: "",
        questionType: QuestionType.MultipleChoice,
        options: [],
      });
    });

  const removeQuestion = (questionId: string) =>
    setQuiz((draft) => {
      const index = getQuestionIndex(draft, questionId);
      draft.questions.splice(index, 1);
    });

  const setQuestionTitle = (questionId: string, title: string) =>
    setQuiz((draft) => {
      const question = getQuestion(draft, questionId);
      question.title = title;
    });

  const setQuestionType = (questionId: string, questionType: QuestionType) => {
    setQuiz((draft) => {
      const question = getQuestion(draft, questionId);
      question.questionType = questionType;
      question.options = getAdjustedOptions(questionType, question.options);
    });
  };

  const addOption = (questionId: string) =>
    setQuiz((draft) => {
      const question = getQuestion(draft, questionId);
      question.options.push({
        id: uuidv4(),
        text: "",
        correct: false,
      });
    });

  const removeOption = (questionId: string, optionId: string) =>
    setQuiz((draft) => {
      const question = getQuestion(draft, questionId);
      const optionIndex = getOptionIndex(question, optionId);
      question.options.splice(optionIndex, 1);
    });

  const setOptionText = (questionId: string, optionId: string, text: string) =>
    setQuiz((draft) => {
      const question = getQuestion(draft, questionId);
      const option = getOption(question, optionId);
      option.text = text;
    });

  const toggleOptionCorrect = (questionId: string, optionId: string) =>
    setQuiz((draft) => {
      const question = getQuestion(draft, questionId);

      // For checkbox questions, we just flip the option's correctness
      if (question.questionType === QuestionType.Checkboxes) {
        const option = getOption(question, optionId);
        option.correct = !option.correct;
      }

      // For multiple choice questions, with only one correct answer,
      // we also have to set have to set the other options to false
      if (question.questionType === QuestionType.MultipleChoice) {
        question.options = question.options.map((option) => ({
          ...option,
          correct: option.id === optionId,
        }));
      }
    });

  return (
    <Page title="Create training quiz">
      <Stack spacing={4}>
        {quiz.questions.map((question) => (
          <QuestionDraft
            key={question.id}
            question={question}
            removeQuestion={removeQuestion}
            setQuestionTitle={setQuestionTitle}
            setQuestionType={setQuestionType}
            addOption={addOption}
            removeOption={removeOption}
            setOptionText={setOptionText}
            toggleOptionCorrect={toggleOptionCorrect}
          />
        ))}
        <Button onClick={addQuestion}>+ Add question</Button>
      </Stack>
    </Page>
  );
}
