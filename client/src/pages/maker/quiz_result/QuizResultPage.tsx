import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  equipmentID?: string;
  score: number;
  passed: boolean;
}

export default function QuizResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const handleButtonClicked = () => {
    // If they failed, the "try again" button takes them back to the quiz
    if (!locationState.passed) {
      navigate(-1);
      return;
    }

    const url = locationState.equipmentID
      ? `/maker/equipment/${locationState.equipmentID}`
      : "/maker/training";

    navigate(url);
  };

  return (
    <Fade in={true}>
      <Stack
        spacing={8}
        sx={{
          width: "100%",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={4}>
          <Box sx={{ display: "inline-flex", position: "relative" }}>
            <CircularProgress
              size={80}
              variant="determinate"
              value={locationState.score}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{ position: "absolute" }}
              >
                {locationState.score}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="h3" component="div">
            {locationState.passed ? "You passed!" : "Quiz failed."}
          </Typography>
        </Stack>

        <Typography variant="body1" align="center">
          {locationState.passed ? (
            <>
              Nicely done! This training module will expire at 12/23/23,
              <br />
              after which you'll need to take this quiz again.
            </>
          ) : (
            <>
              {/* TODO: get the threshold from the quiz result */}
              You need to score at least 80% to pass.
              <br />
              This attempt has been recorded.
            </>
          )}
        </Typography>

        <Button variant="contained" size="large" onClick={handleButtonClicked}>
          {locationState.passed ? "Continue" : "Try again"}
        </Button>
      </Stack>
    </Fade>
  );
}
