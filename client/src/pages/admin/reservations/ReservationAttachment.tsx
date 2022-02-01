import React from "react";
import { Link, Stack } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface ReservationAttachmentProps {
  name: string;
}

export default function ReservationAttachment({
  name,
}: ReservationAttachmentProps) {
  return (
    <Link>
      <Stack direction="row" spacing={1} alignItems="center">
        <FileDownloadIcon fontSize="small" />
        <div>{name}</div>
      </Stack>
    </Link>
  );
}
