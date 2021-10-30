import React from "react";
import { Box } from "@mui/material";
import LogoSvg from "../../../assets/logo.svg";

interface StorefrontPreviewPageProps {}

export default function StorefrontPreviewPage({}: StorefrontPreviewPageProps) {
  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      <img src={LogoSvg} alt="" />
    </Box>
  );
}
