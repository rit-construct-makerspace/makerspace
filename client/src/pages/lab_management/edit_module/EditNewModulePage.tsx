import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {Moduledraft, QuizItem } from "../../../types/Quiz";
import {GET_TRAINING_MODULES, GET_ARCHIVED_TRAINING_MODULES, CREATE_TRAINING_MODULE } from "../../../queries/modules";
import 'react-toastify/dist/ReactToastify.css';
import Page from "../../Page";
import {
    CircularProgress,
    Fab,
    Grid,
    TextField,
} from "@mui/material";
import { useImmer } from "use-immer";
import QuizBuilder from "./quiz/QuizBuilder";
import { toast } from 'react-toastify';
import SaveIcon from "@mui/icons-material/Save";
import { ChangeEventHandler } from "react";
import { DropResult } from "react-beautiful-dnd";


export default function EditNewModulePage() {
    const navigate = useNavigate();

    const [moduleDraft, setModuleDraft] = useImmer<Moduledraft>({
        name: "",
        archived: true,
        quiz: [],
    });

    const [updateModule, updateResult] = useMutation(CREATE_TRAINING_MODULE);

    const executeSave = async (updatedModule: Moduledraft) => {
        await updateModule({
            variables: {
                name: updatedModule.name,
                quiz: updatedModule.quiz,
            },
            refetchQueries: [
                { query: GET_ARCHIVED_TRAINING_MODULES},
                { query: GET_TRAINING_MODULES },
            ],
            onCompleted: () => navigate("/admin/training"),
        });
    }

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


    const handleSaveClicked = async () => {
        if (!moduleDraft.name) {
            window.alert("Please specify a name.");
            return;
        }

        if (moduleDraft.quiz.length == 0) {
            window.alert("Please add content to the training.");
            return;
          }

        await executeSave(moduleDraft);

        trainingModSavedAnimation();
    }


    const handleNameChanged: ChangeEventHandler<HTMLInputElement> = (e) => {
        setModuleDraft({ ...moduleDraft, name: e.target.value });
    };

    const handleAddQuizItem = (item: QuizItem) => {
        setModuleDraft((draft) => {
            draft?.quiz.push(item);
        });
    };

    const handleRemoveQuizItem = (itemId: string) => {
        setModuleDraft((draft) => {
            const index = draft!.quiz.findIndex((i) => i.id === itemId);
            draft?.quiz.splice(index, 1);
        });
    };

    const handleUpdateQuizItem = (itemId: string, updatedItem: QuizItem) => {
        setModuleDraft((draft) => {
            const index = draft!.quiz.findIndex((i) => i.id === itemId);
            draft!.quiz[index] = updatedItem;
        });
    };

    const handleOnDragEnd = (result: DropResult) => {
        setModuleDraft((draft) => {
            if (!result.destination) return;

            const [removed] = draft!.quiz.splice(result.source.index, 1);
            draft!.quiz.splice(result.destination.index, 0, removed);
        });
    };

    return (
        <Page title="New training module" maxWidth="600px">
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
                onChange={handleNameChanged}
                fullWidth
                />
            </Grid>
            </Grid>

            <QuizBuilder quiz={moduleDraft.quiz ? moduleDraft.quiz : []} handleAdd={handleAddQuizItem} handleRemove={handleRemoveQuizItem} handleUpdate={handleUpdateQuizItem} handleOnDragEnd={handleOnDragEnd}/>

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
                updateResult.loading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                    <SaveIcon />
                )}
            </Fab>
        </Page>
    );
}
