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
    image?: boolean;
}

export interface RoomInput {
    name: string;
    image: string;
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
    const [roomDraft, setRoomDraft] = useState<Partial<RoomInput>>({name:"Example", image:"https://i.ytimg.com/vi/nfDgGOCy4ms/maxresdefault.jpg"});

    const [createRoom, { data, loading }] = useMutation(
        CREATE_ROOM,
        {
            variables: { item: roomDraft },
            refetchQueries: [{ query: GET_ROOMS }],
        }
    );

    // Close the modal on successful mutation
    useEffect(() => {
        if (data?.createInventoryItem?.id) onClose();
    }, [data, onClose]);

    const handleStringChange =
        (property: keyof InventoryItemInput) =>
            (e: ChangeEvent<HTMLInputElement>) =>
                setRoomDraft({ ...roomDraft, [property]: e.target.value });

    const handleSaveClick = async () => {
        const updatedInputErrors: InputErrors = {
            name: !roomDraft.name,
            image: !roomDraft.image
        };

        setInputErrors(updatedInputErrors);

        const hasInputErrors = Object.values(updatedInputErrors).some((e) => e);
        if (hasInputErrors) return;

        console.log("createRoom"); //TODO: migration, fix schema etc...
    };

    return (
        <Page title={"New Room"} maxWidth="400px">
            <RoomCard room={{id:0, name:roomDraft.name??"Example", image:roomDraft.image??"https://i.ytimg.com/vi/nfDgGOCy4ms/maxresdefault.jpg"}}></RoomCard>
            <Stack spacing={2} flexGrow={1}>
                <TextField
                    label="Name"
                    value={roomDraft.name ?? ""}
                    error={inputErrors.name}
                    onChange={handleStringChange("name")}
                />
                <TextField
                    label="Image URL"
                    value={roomDraft.image ?? ""}
                    error={inputErrors.image}
                    onChange={handleStringChange("image")}
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
