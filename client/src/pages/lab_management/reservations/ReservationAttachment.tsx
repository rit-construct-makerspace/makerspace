import React from "react";
import { Link, Stack } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface ReservationAttachmentProps {
  name: string;
  url: string;
}

export default function ReservationAttachment({
  name,
  url,
}: ReservationAttachmentProps) {
  return (
    <Link href={url}>
      <Stack direction="row" spacing={1} alignItems="center">
        <FileDownloadIcon fontSize="small" />
        <div>{name}</div>
      </Stack>
    </Link>
  );
}
