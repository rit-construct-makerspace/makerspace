import React from "react";
import { CardActionArea, Stack, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ModuleStatus } from "./TrainingModuleUtils";

export default function MinimalTrainingModuleRow(props: { module: { id: number, name: string }, passed: boolean }) {
  const navigate = useNavigate();

  return (
    <CardActionArea
      sx={{ py: 2 }}
      onClick={() => navigate(`/maker/training/${props.module.id}`)}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {props.passed
          ? <CheckCircleIcon color="success" />
          : <CloseIcon color="error" />}

        <Typography>{props.module.name}</Typography>
      </Stack>
    </CardActionArea>
  );
}
