import React from "react";
import { Box } from "@mui/material";
import NoTransactionView from "./NoTransactionView";

interface StorefrontPreviewPageProps {}

export default function StorefrontPreviewPage({}: StorefrontPreviewPageProps) {
  return (
    <Box sx={{ padding: 4, width: "100%", height: "100vh" }}>
      <NoTransactionView />
    </Box>
  );
}
