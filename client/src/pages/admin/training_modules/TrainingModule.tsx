import React from "react";
import { CardActionArea, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

interface TrainingModuleProps {
  title: string;
}

export default function TrainingModule({ title }: TrainingModuleProps) {
  const history = useHistory();

  return (
    <CardActionArea
      sx={{ p: 1, pl: 2 }}
      onClick={() => history.push("/quiz-builder")}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography
          variant="body1"
          fontWeight={500}
          component="div"
          flexGrow={1}
        >
          {title}
        </Typography>
      </Stack>
    </CardActionArea>
  );
}
