import React from "react";
import ModuleThumbnail from "./ModuleThumbnail";
import { Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface CompletedModuleThumbnailProps {
  title: string;
  image: string;
  completionDate: string;
}

export default function CompletedModuleThumbnail({
  title,
  image,
  completionDate,
}: CompletedModuleThumbnailProps) {
  return (
    <ModuleThumbnail title={title} image={image}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircleIcon fontSize="small" color="success" />
        <Typography variant="body2">{completionDate}</Typography>
      </Stack>
    </ModuleThumbnail>
  );
}
