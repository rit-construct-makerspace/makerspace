import React, { useState } from "react";
import QuizBuilder from "./quiz/QuizBuilder";
import { Button, CircularProgress, Fab, Stack, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Page from "../../Page";
import SaveIcon from "@mui/icons-material/Save";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { useImmer } from "use-immer";
import { QuizItem } from "../../../types/Quiz";
import GET_TRAINING_MODULES from "../../../queries/getModules";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const GET_MODULE = gql`
  query GetModule($id: ID!) {
    module(id: $id) {
      id
      name
      quiz
    }
  }
`;

export const UPDATE_MODULE = gql`
  mutation UpdateModule($id: ID!, $name: String!, $quiz: JSON!) {
    updateModule(id: $id, name: $name, quiz: $quiz) {
      id
    }
  }
`;

export const DELETE_MODULE = gql`
  mutation DeleteModule($id: ID!) {
    deleteModule(id: $id) {
      id
    }
  }
`;

export default function EditModulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [quiz, setQuiz] = useImmer<QuizItem[]>([]);

  const queryResult = useQuery(GET_MODULE, {
    variables: { id },
    onCompleted: ({ module }) => {
      setName(module.name);
      Array.isArray(module.quiz) && setQuiz(module.quiz);
    },
  });

  const [updateModule, updateResult] = useMutation(UPDATE_MODULE);

  const [deleteModule] = useMutation(DELETE_MODULE, {
    variables: { id },
    refetchQueries: [{ query: GET_TRAINING_MODULES }],
    onCompleted: () => navigate("/admin/training"),
  });

  const trainingModSavedAnimation = () => {
    toast.success('Training Module Saved', {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
  }

  const trainingModDeletedAnimation = () => {
    toast.error('Training Module Deleted', {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
  }

  const handleSaveClicked = () => {
    updateModule({
      variables: { id, name, quiz },
      refetchQueries: [
        { query: GET_MODULE, variables: { id } },
        { query: GET_TRAINING_MODULES },
      ],
    });
    trainingModSavedAnimation();
  }

  const handleDeleteClicked = () => {
    if (!window.confirm("Are you sure you want to delete this module?")) {
      return;
    }
    trainingModDeletedAnimation();
    deleteModule();
  }

  return (
    <RequestWrapper2
      result={queryResult}
      render={() => (
        <Page title="Edit training module" maxWidth="600px">
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            />
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 8 }}>
            <TextField
              label="Module title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ width: 400 }}
            />
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              onClick={handleDeleteClicked}
            >
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
            {updateResult.loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              <SaveIcon />
            )}
          </Fab>
        </Page>
      )}
    />
  );
}
