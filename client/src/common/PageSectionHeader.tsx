import React, { ReactNode } from "react";
import { Typography } from "@mui/material";

interface PageSectionHeaderProps {
  children: ReactNode;
  top?: boolean;
}

export default function PageSectionHeader({
  children,
  top,
}: PageSectionHeaderProps) {
  return (
    <Typography variant="h5" component="div" sx={{ mb: 2, mt: top ? 0 : 6 }}>
      {children}
    </Typography>
  );
}
