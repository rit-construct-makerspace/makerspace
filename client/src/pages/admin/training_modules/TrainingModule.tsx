import React from "react";
import { CardActionArea, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

interface TrainingModuleProps {
  id: number;
  title: string;
}

export default function TrainingModule({ id, title }: TrainingModuleProps) {
  const history = useHistory();

  return (
    <CardActionArea
      sx={{ p: 1, pl: 2 }}
      onClick={() => history.push("/admin/training/" + id)}
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
