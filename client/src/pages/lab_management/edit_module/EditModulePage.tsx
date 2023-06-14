import QuizBuilder from "./quiz/QuizBuilder";
import {
  CircularProgress,
  Fab,
  Grid,
  TextField,
} from "@mui/material";
import Page from "../../Page";
import SaveIcon from "@mui/icons-material/Save";
import { useImmer } from "use-immer";
import { Module, QuizItem } from "../../../types/Quiz";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublishTrainingModuleButton from "../training_modules/PublishTrainingModuleButton";
import ArchiveTrainingModuleButton from "../training_modules/ArchiveTrainingModuleButton";
import { DropResult } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const [module, setModule] = useImmer<Module>(moduleInitialValue);

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
    await updateModule(module);

    trainingModSavedAnimation();
    
    navigate(`/admin/training`)
  }

  const handleDeleteClicked = async () => {
    if (!window.confirm("Are you sure you want to delete this module?")) {
      return;
    }

    await deleteModule();

    trainingModDeletedAnimation();
  }

  const handleAddQuizItem = (item: QuizItem) => {
    setModule((draft) => {
      draft?.quiz.push(item);
    });
  };

  const handleRemoveQuizItem = (itemId: string) => {
    setModule((draft) => {
      const index = draft!.quiz.findIndex((i) => i.id === itemId);
      draft?.quiz.splice(index, 1);
    });
  };

  const handleUpdateQuizItem = (itemId: string, updatedItem: QuizItem) => {
    setModule((draft) => {
      const index = draft!.quiz.findIndex((i) => i.id === itemId);
      draft!.quiz[index] = updatedItem;
    });
  };

  const handleOnDragEnd = (result: DropResult) => {
    setModule((draft) => {
      if (!result.destination) return;
      const [removed] = draft!.quiz.splice(result.source.index, 1);
      draft!.quiz.splice(result.destination.index, 0, removed);
    });
  };

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
                value={module.name}
                onChange={(e) => setModule((draft) => {
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
                module.archived
                  ? <PublishTrainingModuleButton moduleID={module.id} appearance="large" />
                  : <ArchiveTrainingModuleButton moduleID={module.id} appearance="large" />
              }
            </Grid>
          </Grid>

          <QuizBuilder quiz={module.quiz ? module.quiz : []} handleAdd={handleAddQuizItem} handleRemove={handleRemoveQuizItem} handleUpdate={handleUpdateQuizItem} handleOnDragEnd={handleOnDragEnd}/>


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
