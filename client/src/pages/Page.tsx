import React, { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

interface PageProps {
  title: string;
  topRightAddons?: ReactNode;
  maxWidth?: string;
  children?: ReactNode;
}

export default function Page({
  title,
  topRightAddons,
  maxWidth = "none",
  children,
}: PageProps) {
  return (
    <Stack alignItems="center" sx={{ padding: 4, width: "100%" }}>
      <Stack sx={{ width: "100%", maxWidth: maxWidth }}>
        <Stack direction="row" alignItems="center" mb={4}>
          <Typography variant="h3" flexGrow={1}>
            {title}
          </Typography>
          {topRightAddons}
        </Stack>

        {children}
      </Stack>
    </Stack>
  );
}
