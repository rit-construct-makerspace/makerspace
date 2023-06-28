import React, { useEffect, useState } from "react";
import AnnouncementModalContents from "./AnnouncementModalContents";
import HistoryIcon from "@mui/icons-material/History";
import { gql, useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import { GET_ANNOUNCEMENTS, GET_ANNOUNCEMENT, CREATE_ANNOUNCEMENT } from "../../../queries/announcementsQueries";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DeleteMaterialButton from "../inventory/DeleteMaterialButton";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";


interface InputErrors {
    title?: boolean;
    description?: boolean;
  }

export default function NewAnnouncementPage() {

    const navigate = useNavigate();

    const query = useQuery(GET_ANNOUNCEMENTS);

    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const [inputErrors, setInputErrors] = useState<InputErrors>({});

    const [createAnnouncement, mutation] = useMutation(CREATE_ANNOUNCEMENT);

    const handleSaveClick = async () => {
        const updatedInputErrors: InputErrors = {
            title: !newTitle,
            description: !newDescription,
        };
    
        setInputErrors(updatedInputErrors);
    
        const hasInputErrors = Object.values(updatedInputErrors).some((e) => e);
        if (hasInputErrors) return;
    
        createAnnouncement({
            variables: {
                title: newTitle,
                description: newDescription,
            },
            refetchQueries: [
                { query: GET_ANNOUNCEMENTS },
                //{ query: GET_ANNOUNCEMENT, variables: { id: announcementID } },
            ],
            onCompleted: () => navigate("/admin/announcements"),
        });
    };

    return (
        <>
            <Typography variant="h5" mb={2}>
                New Announcement
            </Typography>
            <Stack direction="row" spacing={2}>
                <Stack spacing={2} flexGrow={1}>
                    <TextField
                        label="Name"
                        value={newTitle ?? ""}
                        error={inputErrors.title}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField
                        label="Description"
                        sx={{ flex: 1 }}
                        type="string"
                        value={newDescription ?? ""}
                        error={inputErrors.description}
                        onChange={(e) => setNewDescription(e.target.value)}
                        />
                    </Stack>
                </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between" mt={4}>
                <Stack direction="row" spacing={2}>
                    <DeleteMaterialButton />

                    <Button variant="outlined" startIcon={<HistoryIcon />}>
                        View Logs
                    </Button>
                </Stack>

                <LoadingButton
                    loading={mutation.loading}
                    size="large"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ ml: "auto" }}
                    onClick={handleSaveClick}
                >
                    Save
                </LoadingButton>
            </Stack>
        </>
    );
}
