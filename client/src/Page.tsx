import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface PageProps {
  title: string;
}

export default function Page({ title }: PageProps) {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3">{title}</Typography>
    </Box>
  );
}
