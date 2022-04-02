import React from "react";
import { CardActionArea, Stack, Typography } from "@mui/material";
import { ModuleStatus } from "./EquipmentModal";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

interface RequiredModuleProps {
  moduleStatus: ModuleStatus;
}

export default function RequiredModule({ moduleStatus }: RequiredModuleProps) {
  const navigate = useNavigate();

  return (
    <CardActionArea
      sx={{ py: 2 }}
      onClick={() => navigate(`/maker/training/${moduleStatus.moduleID}`)}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {moduleStatus.status === "Passed" && (
          <CheckCircleIcon color="success" />
        )}
        {moduleStatus.status === "Expired" && <WarningIcon color="warning" />}
        {moduleStatus.status === "Not taken" && <CloseIcon color="error" />}

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", width: 80, lineHeight: 1 }}
        >
          {moduleStatus.status}
        </Typography>

        <Typography>{moduleStatus.moduleName}</Typography>

        {moduleStatus.submissionDate && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: "auto !important" }}
          >
            {format(parseISO(moduleStatus.submissionDate), "MM/dd/yyyy")}
          </Typography>
        )}
      </Stack>
    </CardActionArea>
  );
}
