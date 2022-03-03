import React, { useEffect } from "react";
import QuestionDraft from "./QuestionDraft";
import { Button, ButtonGroup, Stack } from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageIcon from "@mui/icons-material/Image";
import YouTubeEmbedDraft from "./YouTubeEmbedDraft";
import ImageEmbedDraft from "./ImageEmbedDraft";
import TextDraft from "./TextDraft";
import { ModuleItemType } from "../../../../types/Module";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import GET_MODULE from "../../../../queries/getModule";

const ADD_MODULE_ITEM = gql`
  mutation AddQuestion($moduleId: ID!, $type: QuestionType!) {
    addQuestion(module_id: $moduleId, question: { text: "", type: $type }) {
      id
    }
  }
`;

const UPDATE_MODULE_ITEM = gql`
  mutation UpdateQuestion(
    $questionId: ID!
    $text: String!
    $type: QuestionType!
  ) {
    updateQuestion(id: $questionId, question: { text: $text, type: $type }) {
      id
    }
  }
`;

const DELETE_MODULE_ITEM = gql`
  mutation DeleteQuestion($questionId: ID!) {
    deleteQuestion(id: $questionId) {
      id
    }
  }
`;

const ADD_QUESTION_OPTION = gql`
  mutation AddOption($questionId: ID!) {
    addOption(question_id: $questionId, option: { text: "", correct: false }) {
      id
    }
  }
`;

const UPDATE_QUESTION_OPTION = gql`
  mutation UpdateQuestionOption(
    $optionId: ID!
    $text: String!
    $correct: Boolean!
  ) {
    updateOption(id: $optionId, option: { text: $text, correct: $correct }) {
      id
    }
  }
`;

const DELETE_QUESTION_OPTION = gql`
  mutation DeleteOption($optionId: ID!) {
    deleteOption(id: $optionId) {
      id
    }
  }
`;

interface QuizBuilderProps {
  setQuizBuilderLoading: (loading: boolean) => void;
}

export default function QuizBuilder({
  setQuizBuilderLoading,
}: QuizBuilderProps) {
  const { id } = useParams<{ id: string }>();
  const getModuleResult = useQuery(GET_MODULE, { variables: { id } });

  const apolloRefetchOptions = {
    refetchQueries: [{ query: GET_MODULE, variables: { id } }],
  };

  const [addModuleItem, addModuleItemResult] = useMutation(
    ADD_MODULE_ITEM,
    apolloRefetchOptions
  );

  const [updateModuleItem, updateModuleItemResult] = useMutation(
    UPDATE_MODULE_ITEM,
    apolloRefetchOptions
  );

  const [deleteModuleItem, deleteModuleItemResult] = useMutation(
    DELETE_MODULE_ITEM,
    apolloRefetchOptions
  );

  const [addQuestionOption, addQuestionOptionResult] = useMutation(
    ADD_QUESTION_OPTION,
    apolloRefetchOptions
  );

  const [updateQuestionOption, updateQuestionOptionResult] = useMutation(
    UPDATE_QUESTION_OPTION,
    apolloRefetchOptions
  );

  const [deleteQuestionOption, deleteQuestionOptionResult] = useMutation(
    DELETE_QUESTION_OPTION,
    apolloRefetchOptions
  );

  const isLoading =
    addModuleItemResult.loading ||
    updateModuleItemResult.loading ||
    deleteModuleItemResult.loading ||
    addQuestionOptionResult.loading ||
    updateQuestionOptionResult.loading ||
    deleteQuestionOptionResult.loading;

  useEffect(() => {
    setQuizBuilderLoading(isLoading);
  }, [setQuizBuilderLoading, isLoading]);

  const handleAddModuleItem = (moduleItemType: ModuleItemType) => () =>
    addModuleItem({
      variables: {
        moduleId: id,
        type: moduleItemType,
      },
    });

  const handleUpdateModuleItem = (
    moduleItemId: number,
    text: string,
    type: ModuleItemType
  ) =>
    updateModuleItem({
      variables: { questionId: moduleItemId, text, type },
    });

  const handleDeleteModuleItem = (questionId: number) => () =>
    deleteModuleItem({ variables: { questionId } });

  const handleAddQuestionOption = (questionId: number) => () =>
    addQuestionOption({ variables: { questionId } });

  const handleUpdateQuestionOption = (
    optionId: number,
    text: string,
    correct: boolean
  ) => updateQuestionOption({ variables: { optionId, text, correct } });

  const handleDeleteQuestionOption = (optionId: number) =>
    deleteQuestionOption({ variables: { optionId } });

  // TODO: reimplement drag and drop reordering
  // const onDragEnd = (result: DropResult) => {
  //   setQuiz((draft) => {
  //     if (!result.destination) return;
  //
  //     const [removed] = draft.items.splice(result.source.index, 1);
  //     draft.items.splice(result.destination.index, 0, removed);
  //   });
  // };

  return (
    <DragDropContext
      onDragEnd={() => {
        // TODO: reimplement drag and drop reordering
      }}
    >
      <Stack>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {getModuleResult.data?.module?.items.map(
                (item: any, index: number) => {
                  switch (item.type) {
                    case ModuleItemType.MultipleChoice:
                    case ModuleItemType.Checkboxes:
                      return (
                        <QuestionDraft
                          key={item.id}
                          index={index}
                          moduleItem={item}
                          updateModuleItem={(
                            text: string,
                            type: ModuleItemType
                          ) => handleUpdateModuleItem(item.id, text, type)}
                          deleteModuleItem={handleDeleteModuleItem(item.id)}
                          addOption={handleAddQuestionOption(item.id)}
                          updateOption={handleUpdateQuestionOption}
                          deleteOption={handleDeleteQuestionOption}
                        />
                      );
                    case ModuleItemType.Text:
                      return (
                        <TextDraft
                          key={item.id}
                          index={index}
                          moduleItem={item}
                          onChange={(updatedText) =>
                            handleUpdateModuleItem(
                              item.id,
                              updatedText,
                              item.type
                            )
                          }
                          onRemove={handleDeleteModuleItem(item.id)}
                        />
                      );
                    case ModuleItemType.YouTube:
                      return (
                        <YouTubeEmbedDraft
                          key={item.id}
                          index={index}
                          moduleItem={item}
                          onChange={(updatedText) =>
                            handleUpdateModuleItem(
                              item.id,
                              updatedText,
                              item.type
                            )
                          }
                          onRemove={handleDeleteModuleItem(item.id)}
                        />
                      );
                    case ModuleItemType.Image:
                      return (
                        <ImageEmbedDraft
                          key={item.id}
                          index={index}
                          moduleItem={item}
                          onChange={(updatedText) =>
                            handleUpdateModuleItem(
                              item.id,
                              updatedText,
                              item.type
                            )
                          }
                          onRemove={handleDeleteModuleItem(item.id)}
                        />
                      );
                    default:
                      return null;
                  }
                }
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <ButtonGroup fullWidth={true} sx={{ minWidth: 600 }}>
          <Button
            startIcon={<ContactSupportIcon />}
            onClick={handleAddModuleItem(ModuleItemType.MultipleChoice)}
          >
            Question
          </Button>

          <Button
            startIcon={<TextFieldsIcon />}
            onClick={handleAddModuleItem(ModuleItemType.Text)}
          >
            Text
          </Button>

          <Button
            startIcon={<YouTubeIcon />}
            onClick={handleAddModuleItem(ModuleItemType.YouTube)}
          >
            Video
          </Button>

          <Button
            startIcon={<ImageIcon />}
            onClick={handleAddModuleItem(ModuleItemType.Image)}
          >
            Image
          </Button>
        </ButtonGroup>
      </Stack>
    </DragDropContext>
  );
}
