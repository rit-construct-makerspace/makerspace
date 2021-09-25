import React, { ReactNode } from "react";
import { Card, CardActions, IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface QuizItemDraftProps {
  children: ReactNode;
  extraActions?: ReactNode;
}

export default function QuizItemDraft({
  children,
  extraActions,
}: QuizItemDraftProps) {
  return (
    <Card elevation={4} sx={{ width: 600 }}>
      {children}
      <CardActions>
        <IconButton aria-label="Delete">
          <DeleteOutlineIcon />
        </IconButton>
        <IconButton aria-label="Duplicate">
          <ContentCopyIcon />
        </IconButton>
        {extraActions}
      </CardActions>
    </Card>
  );
}
