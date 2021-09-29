import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface PageProps {
  title: string;
  children?: ReactNode;
}

export default function Page({ title, children }: PageProps) {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" paddingBottom={4}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
