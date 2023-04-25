import React, { ChangeEvent, useState } from "react";
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
import { Announcement } from "../../../queries/getAnnouncements";
import DeleteMaterialButton from "../inventory/DeleteMaterialButton";

interface InputErrors {
  title?: boolean;
  description?: boolean;
}

export interface AnnouncementInput {
  title: string;
  description: string;
}

interface AnnouncementPageProps {
  isNewAnnouncement: boolean;
  announcementDraft: Partial<Announcement>;
  setAnnouncementDraft: (i: Partial<Announcement>) => void;
  onSave: () => void;
  loading: boolean;
}

export default function AnnouncementModalContents({
  isNewAnnouncement,
  announcementDraft,
  setAnnouncementDraft,
  onSave,
  loading,
}: AnnouncementPageProps) {
  const [inputErrors, setInputErrors] = useState<InputErrors>({});

  const handleStringChange =
    (property: keyof AnnouncementInput) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setAnnouncementDraft({ ...announcementDraft, [property]: e.target.value });

  const handleSaveClick = async () => {
    const updatedInputErrors: InputErrors = {
      title: !announcementDraft.title,
      description: !announcementDraft.description,
    };

    setInputErrors(updatedInputErrors);

    const hasInputErrors = Object.values(updatedInputErrors).some((e) => e);
    if (hasInputErrors) return;

    onSave();
  };

  const title = `${isNewAnnouncement ? "New" : "Edit"} Announcement`;

  return (
    <>
      <Typography variant="h5" mb={2}>
        {title}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Stack spacing={2} flexGrow={1}>
          <TextField
            label="Name"
            value={announcementDraft.title ?? ""}
            error={inputErrors.title}
            onChange={handleStringChange("title")}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Description"
              sx={{ flex: 1 }}
              type="string"
              value={announcementDraft.description ?? ""}
              error={inputErrors.description}
              onChange={handleStringChange("description")}
            />
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="space-between" mt={4}>
        {!isNewAnnouncement && (
          <Stack direction="row" spacing={2}>
            <DeleteMaterialButton />

            <Button variant="outlined" startIcon={<HistoryIcon />}>
              View Logs
            </Button>
          </Stack>
        )}

        <LoadingButton
          loading={loading}
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
