import React from "react";
import Page from "../../Page";
import {
  ImageEmbed,
  Question,
  QuestionType,
  Quiz,
  QuizItem,
  QuizItemType,
  YoutubeEmbed,
} from "../../../types/Quiz";
import { v4 as uuidv4 } from "uuid";
import { useImmer } from "use-immer";
import QuestionDraft from "./QuestionDraft";
import { Button, ButtonGroup, Stack } from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ImageIcon from "@mui/icons-material/Image";
import YouTubeEmbedDraft from "./YouTubeEmbedDraft";

interface QuizBuilderPageProps {}

export default function QuizBuilderPage({}: QuizBuilderPageProps) {
  const [quiz, setQuiz] = useImmer<Quiz>({
    id: uuidv4(),
    items: [],
  });

  const addItem = (item: QuizItem) =>
    setQuiz((draft) => {
      draft.items.push(item);
    });

  const removeItem = (itemId: string) => {
    setQuiz((draft) => {
      const index = draft.items.findIndex((i) => i.id === itemId);
      draft.items.splice(index, 1);
    });
  };

  const updateItem = (itemId: string, updatedItem: QuizItem) => {
    setQuiz((draft) => {
      const index = draft.items.findIndex((i) => i.id === itemId);
      draft.items[index] = updatedItem;
    });
  };

  const createQuestion = () => {
    const newQuestion: Question = {
      quizItemType: QuizItemType.Question,
      id: uuidv4(),
      title: "",
      options: [],
      questionType: QuestionType.MultipleChoice,
    };

    addItem(newQuestion);
  };

  const createYoutubeEmbed = () => {
    const newVideoEmbed: YoutubeEmbed = {
      quizItemType: QuizItemType.YoutubeEmbed,
      id: uuidv4(),
      embedId: "",
    };

    addItem(newVideoEmbed);
  };

  const createImageEmbed = () => {
    const newImageEmbed: ImageEmbed = {
      quizItemType: QuizItemType.ImageEmbed,
      id: uuidv4(),
      href: "",
    };

    addItem(newImageEmbed);
  };

  return (
    <Page title="Create training quiz">
      <Stack spacing={4}>
        {quiz.items.map((item) => {
          switch (item.quizItemType) {
            case QuizItemType.Question:
              return (
                <QuestionDraft
                  key={item.id}
                  question={item}
                  updateQuestion={(updatedQuestion) =>
                    updateItem(item.id, updatedQuestion)
                  }
                  removeQuestion={() => removeItem(item.id)}
                />
              );
            case QuizItemType.YoutubeEmbed:
              return (
                <YouTubeEmbedDraft
                  youtubeEmbed={item}
                  updateYoutubeEmbed={(updatedYoutubeEmbed) => {
                    updateItem(item.id, updatedYoutubeEmbed);
                  }}
                  onRemove={() => removeItem(item.id)}
                />
              );
            case QuizItemType.ImageEmbed:
              return <div>imgur</div>;
          }
        })}

        <ButtonGroup fullWidth={true}>
          <Button startIcon={<ContactSupportIcon />} onClick={createQuestion}>
            Question
          </Button>

          <Button startIcon={<YouTubeIcon />} onClick={createYoutubeEmbed}>
            Video
          </Button>

          <Button startIcon={<ImageIcon />} onClick={createImageEmbed}>
            Image
          </Button>
        </ButtonGroup>
      </Stack>
    </Page>
  );
}
