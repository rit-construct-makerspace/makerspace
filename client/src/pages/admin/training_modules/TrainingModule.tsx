import React from "react";
import {
  Button,
  ButtonGroup,
  CardActionArea,
  Stack,
  Typography,
} from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import HandymanIcon from "@mui/icons-material/Handyman";
import PeopleIcon from "@mui/icons-material/People";
import { useHistory } from "react-router-dom";

interface TrainingModuleProps {
  title: string;
  questionCount: number;
  equipmentCount: number;
  makerCount: number;
}

export default function TrainingModule({
  title,
  questionCount,
  equipmentCount,
  makerCount,
}: TrainingModuleProps) {
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

        <ButtonGroup
          size="small"
          variant="text"
          sx={{ maxWidth: 300 }}
          fullWidth
        >
          <Button startIcon={<ContactSupportIcon />}>{questionCount}</Button>

          <Button startIcon={<HandymanIcon />}>{equipmentCount}</Button>

          <Button startIcon={<PeopleIcon />}>{makerCount}</Button>
        </ButtonGroup>
      </Stack>
    </CardActionArea>
  );
}
