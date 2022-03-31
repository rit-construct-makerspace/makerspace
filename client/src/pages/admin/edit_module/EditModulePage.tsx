import React, { useState } from "react";
import QuizBuilder from "./quiz/QuizBuilder";
import { Button, CircularProgress, Fab, Stack, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Page from "../../Page";
import SaveIcon from "@mui/icons-material/Save";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { useImmer } from "use-immer";
import { QuizItem } from "../../../types/Quiz";
import GET_TRAINING_MODULES from "../../../queries/getModules";

const GET_MODULE = gql`
  query GetModule($id: ID!) {
    module(id: $id) {
      name
      quiz
    }
  }
`;

const UPDATE_MODULE = gql`
  mutation UpdateModule($id: ID!, $name: String!, $quiz: JSON!) {
    updateModule(id: $id, name: $name, quiz: $quiz) {
      id
    }
  }
`;

export default function EditModulePage() {
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [quiz, setQuiz] = useImmer<QuizItem[]>([]);

  const queryResult = useQuery(GET_MODULE, {
    variables: { id },
    onCompleted: ({ module }) => {
      setName(module.name);
      Array.isArray(module.quiz) && setQuiz(module.quiz);
    },
  });

  const [updateQuiz, mutationResult] = useMutation(UPDATE_MODULE);

  const handleSaveClicked = () =>
    updateQuiz({
      variables: { id, name, quiz },
      refetchQueries: [
        { query: GET_MODULE, variables: { id } },
        { query: GET_TRAINING_MODULES },
      ],
    });

  return (
    <RequestWrapper2
      result={queryResult}
      render={() => (
        <Page title="Edit training module" maxWidth="600px">
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 8 }}>
            <TextField
              label="Module title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ width: 400 }}
            />
            <Button startIcon={<DeleteIcon />} color="error">
              Delete
            </Button>
          </Stack>

          <QuizBuilder quiz={quiz} setQuiz={setQuiz} />

          <Fab
            color="primary"
            onClick={handleSaveClicked}
            sx={{
              position: "absolute",
              bottom: 40,
              mr: -12,
              alignSelf: "flex-end",
            }}
          >
            <SaveIcon />
            {/*<CircularProgress size={20} sx={{ color: "white" }} />*/}
          </Fab>
        </Page>
      )}
    />
  );
}
