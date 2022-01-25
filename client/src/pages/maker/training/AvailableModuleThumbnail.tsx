import React from "react";
import ModuleThumbnail from "./ModuleThumbnail";
import { Typography } from "@mui/material";

interface AvailableModuleThumbnailProps {
  title: string;
  image: string;
  estimatedDuration: number;
}

export default function AvailableModuleThumbnail({
  title,
  image,
  estimatedDuration,
}: AvailableModuleThumbnailProps) {
  return (
    <ModuleThumbnail title={title} image={image}>
      <Typography variant="body2">~{estimatedDuration} minutes</Typography>
    </ModuleThumbnail>
  );
}
