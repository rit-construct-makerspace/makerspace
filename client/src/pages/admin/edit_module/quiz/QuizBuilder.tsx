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
import { Module, QuizItem, QuizItemType } from "../../../../types/Quiz";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import EmptyPageSection from "../../../../common/EmptyPageSection";

interface QuizBuilderProps {
  quiz: QuizItem[];
  setModuleDraft: Updater<Module | undefined>;
}

export default function QuizBuilder({ quiz, setModuleDraft: setModuleDraft }: QuizBuilderProps) {
  const addItem = (item: QuizItem) =>
    setModuleDraft((draft) => {
      draft?.quiz.push(item);
    });

  const removeItem = (itemId: string) => {
    setModuleDraft((draft) => {
      const index = draft!.quiz.findIndex((i) => i.id === itemId);
      draft?.quiz.splice(index, 1);
    });
  };

  const updateItem = (itemId: string, updatedItem: QuizItem) => {
    setModuleDraft((draft) => {
      const index = draft!.quiz.findIndex((i) => i.id === itemId);
      draft!.quiz[index] = updatedItem;
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
    setModuleDraft((draft) => {
      if (!result.destination) return;

      const [removed] = draft!.quiz.splice(result.source.index, 1);
      draft!.quiz.splice(result.destination.index, 0, removed);
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

        <ButtonGroup fullWidth sx={{ width: 600, backgroundColor: "white" }}>
          <Button sx={{fontSize: 13}} startIcon={<ContactSupportIcon />} onClick={createQuestion}>
            Question
          </Button>

          <Button sx={{fontSize: 13}} startIcon={<TextFieldsIcon />} onClick={createText}>
            Text
          </Button>

          <Button sx={{fontSize: 13}} startIcon={<YouTubeIcon />} onClick={createYoutubeEmbed}>
            Video
          </Button>

          <Button sx={{fontSize: 13}} startIcon={<ImageIcon />} onClick={createImageEmbed}>
            Image
          </Button>
        </ButtonGroup>
      </Stack>
    </DragDropContext>
  );
}
