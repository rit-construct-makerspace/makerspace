import { Badge, Tooltip } from "@mui/material";
import { ReactNode } from "react";

interface IconStatusBadgeProps {
  icon: ReactNode;
  badgeContent: ReactNode;
  badgeColor: "success" | "error" | "warning" | "primary" | "secondary" | "info";
  tooltipText: string;
}

export function IconStatusBadge(props: IconStatusBadgeProps) {

  return (
    <Tooltip title={props.tooltipText}>
      <Badge color={props.badgeColor} badgeContent={props.badgeContent}>
        {props.icon}
      </Badge>
    </Tooltip>
  )
}