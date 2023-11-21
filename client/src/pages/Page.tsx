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
  maxWidth = "100%",
  children,
}: PageProps) {
  return (
    <Stack
      alignItems="center"
      sx={{ width: "100%", height: "100vh", overflowY: "auto" }}
    >
      <Stack
        sx={{
          p: 4,
          width: "100%",
          maxWidth: `min(calc(100% - 64px), ${maxWidth})`,
        }}
      >
        <Stack direction="row" alignItems="center" mb={4}>
          <Typography variant="h4" flexGrow={1}>
            {title}
          </Typography>
          {topRightAddons}
        </Stack>

        {children}
      </Stack>
    </Stack>
  );
}
