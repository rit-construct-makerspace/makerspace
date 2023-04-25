import { useState } from "react";
import QuizBuilder from "./quiz/QuizBuilder";
import {
  Button,
  CircularProgress,
  Fab,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Page from "../../Page";
import SaveIcon from "@mui/icons-material/Save";
import { useMutation, useQuery } from "@apollo/client";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { Updater, useImmer } from "use-immer";
import { Module, ReservationPrompt } from "../../../types/Quiz";
import { GET_MODULE, GET_TRAINING_MODULES, UPDATE_MODULE, ARCHIVE_MODULE } from "../../../queries/modules";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReservationPromptDraft from "./reservation_prompt/ReservationPromptDraft";
import PublishTrainingModuleButton from "../training_modules/PublishTrainingModuleButton";
import ArchiveTrainingModuleButton from "../training_modules/ArchiveTrainingModuleButton";

interface EditModulePageProps {
  moduleInitialValue: Module;
  deleteModule: () => Promise<void>;
  updateModule: (updatedModule: Module) => Promise<void>;
  updateLoading: boolean;
}

export default function EditModulePage({
    moduleInitialValue,
    deleteModule,
    updateModule,
    updateLoading
}: EditModulePageProps) {

  const [moduleDraft, setModuleDraft] = useImmer<Module>(moduleInitialValue);

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

  const handleSaveClicked = async () => {
    await updateModule(moduleDraft);

    trainingModSavedAnimation();
  }

  const handleDeleteClicked = async () => {
    if (!window.confirm("Are you sure you want to delete this module?")) {
      return;
    }

    await deleteModule();

    trainingModDeletedAnimation();
  }

  return (
    <Page title="Edit training module" maxWidth="600px">
          <Grid container
            rowSpacing={2}
            columnSpacing={2}
            sx={{ mb: 4 }}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item
              xs={12}
              md={8}>
              <TextField
                label="Module title"
                value={moduleDraft.name}
                onChange={(e) => setModuleDraft((draft) => {
                  draft.name = e.target.value;
                })}
                fullWidth
              />
            </Grid>
            <Grid item
              xs={12}
              md={4}
              justifySelf="center">
              {
                moduleDraft.archived
                  ? <PublishTrainingModuleButton moduleID={moduleDraft.id} appearance="large" />
                  : <ArchiveTrainingModuleButton moduleID={moduleDraft.id} appearance="large" />
              }
            </Grid>
          </Grid>

          <QuizBuilder quiz={moduleDraft.quiz ? moduleDraft.quiz : []} setModuleDraft={setModuleDraft} />

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
            {
              updateLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <SaveIcon />
              )}
          </Fab>
    </Page>
  );
}
