import React from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import BackButton from "../common/BackButton";
import UploadIcon from "@mui/icons-material/Upload";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface FilesAndNotesStepProps {
  comment: string;
  setComment: (comment: string) => void;
  onBackClicked: () => void;
  onNextClicked: () => void;
}

export default function FilesAndNotesStep({
  comment,
  setComment,
  onBackClicked,
  onNextClicked,
}: FilesAndNotesStepProps) {
  return (
    <Stack>
      <Button
        startIcon={<UploadIcon />}
        variant="outlined"
        onClick={() => window.alert("Coming soon!")}
      >
        Upload files
      </Button>

      <Typography color="text.secondary" variant="body2" align="center" mt={1}>
        Feel free to upload diagrams, CAD files, etc. for our labbies to take a
        look at.
      </Typography>

      <TextField
        label="Comment"
        placeholder="Questions, clarifications, etc."
        multiline
        rows={4}
        sx={{ mt: 8 }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <BackButton onClick={onBackClicked} />

        <Button
          endIcon={<ArrowForwardIcon />}
          variant="contained"
          onClick={onNextClicked}
        >
          Confirm
        </Button>
      </Stack>
    </Stack>
  );
}
