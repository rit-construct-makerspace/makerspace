import React from "react";
import { Tooltip, TooltipProps } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

// Omit children prop because the whole point of this component is that
// the help icon is pre-supplied as the child.
export default function HelpTooltip(props: Omit<TooltipProps, "children">) {
  return (
    <Tooltip {...props}>
      <HelpIcon sx={{ width: 20, height: 20, opacity: 0.5 }} />
    </Tooltip>
  );
}
