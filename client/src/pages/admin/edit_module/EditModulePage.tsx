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
  AccordionDetails,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Page from "../../Page";
import SaveIcon from "@mui/icons-material/Save";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { useImmer } from "use-immer";
import { Module, ReservationPrompt } from "../../../types/Quiz";
import { GET_MODULE, GET_TRAINING_MODULES, UPDATE_MODULE, DELETE_MODULE } from "../../../queries/modules";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ReservationPromptDraft from "./reservation_prompt/ReservationPromptDraft";
import { Drafts } from "@mui/icons-material";
import {getModules} from "../../../../../server/src/repositories/Training/ModuleRepository";

export default function EditModulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [module, setModuleDraft] = useImmer<Module | undefined>(undefined);
  const [requiresReservation, setRequiresReservation] = useState(false);

  const queryResult = useQuery(GET_MODULE, {
    variables: { id },
    onCompleted: ({ module }) => {
      setName(module.name);
      Array.isArray(module.quiz) && setModuleDraft(module);
      setRequiresReservation(module?.reservationPrompt?.enabled ? true : false);
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
  };

  const incompleteTrainingModuleAnimation = () => {
    toast.error('Training Module Incomplete', {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

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
  };

  const handleSaveClicked = () => {

    if (Number(module?.quiz?.length) > 0) {
      updateModule({
        variables: {id, name, quiz: module?.quiz, reservationPrompt: module?.reservationPrompt},
        refetchQueries: [
          {query: GET_MODULE, variables: {id}},
          {query: GET_TRAINING_MODULES},
        ],
      });
      trainingModSavedAnimation();
      navigate("/admin/training");
    }
    else {
      incompleteTrainingModuleAnimation();
    }
  };

  const handleDeleteClicked = () => {
    if (!window.confirm("Are you sure you want to delete this module?")) {
      return;
    }
    trainingModDeletedAnimation();
    deleteModule();
  };

  return (
    <RequestWrapper2
      result={queryResult}
      render={() => (
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item
              xs={12}
              md={4}
              justifySelf="center">
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleDeleteClicked}
                sx={{ marginLeft: "auto" }}
              >
                Delete
              </Button>
            </Grid>

            <Grid item xs={12} >
              <Accordion
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none'
                }}>
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <ExpandMoreIcon/>
                  <Typography >Options</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: 1, borderColor: "#BBBBBB" }}>
                  <FormGroup>
                    <FormControlLabel
                      label={<Typography sx={{ fontSize: 15 }}>Requires reservation</Typography>}
                      labelPlacement="end"
                      control={
                        <Switch
                            checked={ requiresReservation }
                            aria-label="Requires reservation switch"
                            onChange={(e) => {
                              if (e.target.checked == true) {
                                setRequiresReservation(true);
                                setModuleDraft((draft) => {
                                  draft!.reservationPrompt.enabled = true;
                                });
                              }
                              else {
                                setRequiresReservation(false);
                                setModuleDraft((draft) => {
                                  draft!.reservationPrompt.enabled = false;
                                });
                              }
                            }}
                            sx={{
                              '& .MuiSwitch-thumb': {
                                borderRadius: '2px',
                              },
                              '& .MuiSwitch-track': {
                                borderRadius: '2px',
                              },
                            }}
                        />
                      }
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>

          <QuizBuilder quiz={module?.quiz ? module?.quiz : []} setModuleDraft={setModuleDraft} />

          {
            requiresReservation ?
                <Grid container sx={{ mt: 5 }}>
                  <Grid item width={0.25}>
                    <ReservationPromptDraft
                      item={module?.reservationPrompt}
                      updatePrompt={(prompt: ReservationPrompt) => setModuleDraft((draft) => {
                        draft!.reservationPrompt = prompt;
                      })}
                    />
                  </Grid>
                </Grid>
              : null
          }

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
