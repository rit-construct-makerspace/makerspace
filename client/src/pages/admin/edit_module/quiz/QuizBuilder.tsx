import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useImmer } from "use-immer";
import QuestionDraft from "./QuestionDraft";
import { Button, ButtonGroup, Stack } from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageIcon from "@mui/icons-material/Image";
import YouTubeEmbedDraft from "./YouTubeEmbedDraft";
import ImageEmbedDraft from "./ImageEmbedDraft";
import TextDraft from "./TextDraft";
import {
  ImageEmbed,
  Question,
  QuestionType,
  Quiz,
  QuizItem,
  QuizItemType,
  Text,
  YoutubeEmbed,
} from "../../../../types/Quiz";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

interface QuizBuilderPageProps {}

export default function QuizBuilder({}: QuizBuilderPageProps) {
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

  const createText = () => {
    const newText: Text = {
      quizItemType: QuizItemType.Text,
      id: uuidv4(),
      text: "",
    };

    addItem(newText);
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

  const onDragEnd = (result: DropResult) => {
    setQuiz((draft) => {
      if (!result.destination) return;

      const [removed] = draft.items.splice(result.source.index, 1);
      draft.items.splice(result.destination.index, 0, removed);
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {quiz.items.map((item, index) => {
                switch (item.quizItemType) {
                  case QuizItemType.Question:
                    return (
                      <QuestionDraft
                        key={item.id}
                        index={index}
                        question={item}
                        updateQuestion={(updatedQuestion) =>
                          updateItem(item.id, updatedQuestion)
                        }
                        removeQuestion={() => removeItem(item.id)}
                      />
                    );
                  case QuizItemType.Text:
                    return (
                      <TextDraft
                        key={item.id}
                        index={index}
                        text={item}
                        updateText={(updatedText) => {
                          updateItem(item.id, updatedText);
                        }}
                        onRemove={() => removeItem(item.id)}
                      />
                    );
                  case QuizItemType.YoutubeEmbed:
                    return (
                      <YouTubeEmbedDraft
                        key={item.id}
                        index={index}
                        youtubeEmbed={item}
                        updateYoutubeEmbed={(updatedYoutubeEmbed) => {
                          updateItem(item.id, updatedYoutubeEmbed);
                        }}
                        onRemove={() => removeItem(item.id)}
                      />
                    );
                  case QuizItemType.ImageEmbed:
                    return (
                      <ImageEmbedDraft
                        key={item.id}
                        index={index}
                        imageEmbed={item}
                        updateImageEmbed={(updatedImageEmbed) => {
                          updateItem(item.id, updatedImageEmbed);
                        }}
                        onRemove={() => removeItem(item.id)}
                      />
                    );
                }
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <ButtonGroup fullWidth={true} sx={{ minWidth: 600 }}>
          <Button startIcon={<ContactSupportIcon />} onClick={createQuestion}>
            Question
          </Button>

          <Button startIcon={<TextFieldsIcon />} onClick={createText}>
            Text
          </Button>

          <Button startIcon={<YouTubeIcon />} onClick={createYoutubeEmbed}>
            Video
          </Button>

          <Button startIcon={<ImageIcon />} onClick={createImageEmbed}>
            Image
          </Button>
        </ButtonGroup>
      </Stack>
    </DragDropContext>
  );
}
