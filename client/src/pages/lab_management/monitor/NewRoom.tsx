import React, {ChangeEvent, useEffect, useState} from "react";
import {
    Button,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import HelpTooltip from "../../../common/HelpTooltip";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import styled from "styled-components";
import InventoryItem from "../../../types/InventoryItem";
import Page from "../../Page";
import {InventoryItemInput} from "../inventory/MaterialModalContents";
import RoomCard from "./RoomCard";
import {useMutation} from "@apollo/client";
import GET_ROOMS, {CREATE_ROOM} from "../../../queries/roomQueries";

interface InputErrors {
    name?: boolean;
    pictureURL?: boolean;
}

export interface RoomInput {
    name: string;
    pictureURL: string;
}

interface NewRoomProps {
    //isNew: boolean;
    //onSave: () => void;
    onClose: () => void;
    //onDelete: () => void;
    //loading: boolean;
}

export default function NewRoom({
    //isNew,
    //onSave,
    onClose,
    //onDelete,
    //loading,
}: NewRoomProps) {
    const [inputErrors, setInputErrors] = useState<InputErrors>({});
    const [roomDraft, setRoomDraft] = useState<Partial<RoomInput>>({name:"Example", pictureURL:"https://i.ytimg.com/vi/nfDgGOCy4ms/maxresdefault.jpg"});

    const [createRoom, { data, loading }] = useMutation(
        CREATE_ROOM,
        {
            variables: { input: roomDraft },
            refetchQueries: [{ query: GET_ROOMS }],
        }
    );

    // Close the modal on successful mutation
    useEffect(() => {
        if (data?.createInventoryItem?.id) onClose();
    }, [data, onClose]);

    const handleStringChange =
        (property: keyof RoomInput) =>
            (e: ChangeEvent<HTMLInputElement>) =>
                setRoomDraft({ ...roomDraft, [property]: e.target.value });

    const handleSaveClick = async () => {
        const updatedInputErrors: InputErrors = {
            name: !roomDraft.name,
            pictureURL: !roomDraft.pictureURL
        };

        setInputErrors(updatedInputErrors);

        const hasInputErrors = Object.values(updatedInputErrors).some((e) => e);
        if (hasInputErrors) return;

        await createRoom()
    };

    return (
        <Page title={"New Room"} maxWidth="400px">
            <RoomCard room={{id:0, name:roomDraft.name??"Example", pictureURL:roomDraft.pictureURL??""}}></RoomCard>
            <Stack spacing={2} flexGrow={1}>
                <TextField
                    label="Name"
                    value={roomDraft.name ?? ""}
                    error={inputErrors.name}
                    onChange={handleStringChange("name")}
                />
                <TextField
                    label="Image URL"
                    value={roomDraft.pictureURL ?? ""}
                    error={inputErrors.pictureURL}
                    onChange={handleStringChange("pictureURL")}
                />
            </Stack>

            <LoadingButton
                loading={loading}
                size="large"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ ml: "auto", mt:1 }}
                onClick={handleSaveClick}
            >
                Save
            </LoadingButton>
        </Page>
    );
}
