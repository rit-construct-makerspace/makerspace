import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Updater } from "use-immer";
import QuestionDraft from "./QuestionDraft";
import { Button, ButtonGroup, Stack } from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageIcon from "@mui/icons-material/Image";
import YouTubeEmbedDraft from "./YouTubeEmbedDraft";
import ImageEmbedDraft from "./ImageEmbedDraft";
import TextDraft from "./TextDraft";
import { QuizItem, QuizItemType } from "../../../../types/Quiz";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import EmptyPageSection from "../../../../common/EmptyPageSection";

interface QuizBuilderProps {
  quiz: QuizItem[];
  setQuiz: Updater<QuizItem[]>;
}

export default function QuizBuilder({ quiz, setQuiz }: QuizBuilderProps) {
  const addItem = (item: QuizItem) =>
    setQuiz((draft) => {
      draft.push(item);
    });

  const removeItem = (itemId: string) => {
    setQuiz((draft) => {
      const index = draft.findIndex((i) => i.id === itemId);
      draft.splice(index, 1);
    });
  };

  const updateItem = (itemId: string, updatedItem: QuizItem) => {
    setQuiz((draft) => {
      const index = draft.findIndex((i) => i.id === itemId);
      draft[index] = updatedItem;
    });
  };

  const createQuestion = () =>
    addItem({
      id: uuidv4(),
      type: QuizItemType.MultipleChoice,
      text: "",
      options: [],
    });

  const createText = () =>
    addItem({
      id: uuidv4(),
      type: QuizItemType.Text,
      text: "",
    });

  const createYoutubeEmbed = () =>
    addItem({
      id: uuidv4(),
      type: QuizItemType.YoutubeEmbed,
      text: "",
    });

  const createImageEmbed = () =>
    addItem({
      id: uuidv4(),
      type: QuizItemType.ImageEmbed,
      text: "",
    });

  const onDragEnd = (result: DropResult) => {
    setQuiz((draft) => {
      if (!result.destination) return;

      const [removed] = draft.splice(result.source.index, 1);
      draft.splice(result.destination.index, 0, removed);
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack alignItems="center">
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {quiz.map((item, index) => {
                switch (item.type) {
                  case QuizItemType.MultipleChoice:
                  case QuizItemType.Checkboxes:
                    return (
                      <QuestionDraft
                        key={item.id}
                        index={index}
                        item={item}
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
                        item={item}
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
                  default:
                    return null;
                }
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {!quiz.length && (
          <EmptyPageSection
            label="Add items via the buttons below."
            sx={{ mb: 2, alignSelf: "stretch" }}
          />
        )}

        <ButtonGroup fullWidth sx={{ width: 600 }}>
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
