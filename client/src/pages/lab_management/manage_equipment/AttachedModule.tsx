import React from "react";
import { ObjectSummary } from "../../../types/Common";
import { IconButton, Stack, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";

interface AttachedModuleProps {
  module: ObjectSummary;
  onRemove: () => void;
}

export default function AttachedModule({
  module,
  onRemove,
}: AttachedModuleProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ ":last-child": { mb: 2 } }}
    >
      <Typography sx={{ flex: 1 }}>{module.name}</Typography>
      <IconButton
        aria-label="View module"
        onClick={() => window.open(`/admin/training/${module.id}`)}
      >
        <OpenInNewIcon />
      </IconButton>
      <IconButton aria-label="Detach module" onClick={onRemove}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
