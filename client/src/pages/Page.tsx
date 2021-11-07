import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

interface PageProps {
  title: string;
  topRightAddons?: ReactNode;
  children?: ReactNode;
}

export default function Page({ title, topRightAddons, children }: PageProps) {
  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      <Stack direction="row" alignItems="center" mb={4}>
        <Typography variant="h3" flexGrow={1}>
          {title}
        </Typography>
        {topRightAddons}
      </Stack>

      {children}
    </Box>
  );
}
