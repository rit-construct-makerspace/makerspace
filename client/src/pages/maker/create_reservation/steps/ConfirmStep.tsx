import React from "react";
import { Alert, Stack, Typography } from "@mui/material";
import BackButton from "../common/BackButton";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PrettyDate, { formatPrettyDate } from "../common/PrettyDate";
import { formatPrettyTime } from "../common/TimeslotButton";
import { gql, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useCurrentUser } from "../../../../common/CurrentUserProvider";

const CREATE_RESERVATION = gql`
  mutation CreateReservation(
    $makerID: ID!
    $equipmentID: ID!
    $startTime: DateTime!
    $endTime: DateTime!
    $comment: String
  ) {
    createReservation(
      reservation: {
        makerID: $makerID
        equipmentID: $equipmentID
        startTime: $startTime
        endTime: $endTime
        comment: $comment
      }
    ) {
      id
    }
  }
`;

interface ConfirmStepProps {
  startTime: string;
  endTime: string;
  comment: string;
  onBackClicked: () => void;
}

export default function ConfirmStep({
  startTime,
  endTime,
  comment,
  onBackClicked,
}: ConfirmStepProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useCurrentUser();

  const [createReservation, result] = useMutation(CREATE_RESERVATION, {
    variables: {
      makerID: user.id,
      equipmentID: id,
      startTime,
      endTime,
      comment,
    },
    onCompleted: () => navigate("/maker/reservations"),
  });

  console.log(startTime);

  return (
    <Stack>
      <PrettyDate date={formatPrettyDate(startTime)} />

      <Stack direction="row" spacing={0.8}>
        <Typography variant="body1">From</Typography>
        <Typography variant="body1" fontWeight={500}>
          {formatPrettyTime(startTime)}
        </Typography>
        <Typography variant="body1">to</Typography>
        <Typography variant="body1" fontWeight={500}>
          {formatPrettyTime(endTime)}
        </Typography>
      </Stack>

      {comment && (
        <Alert
          severity="info"
          icon={<ChatBubbleOutlineIcon fontSize="small" />}
          sx={{ mt: 4 }}
        >
          {comment}
        </Alert>
      )}

      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <BackButton onClick={onBackClicked} />

        <LoadingButton
          loading={result.loading}
          onClick={() => createReservation()}
          startIcon={<EventAvailableIcon />}
          variant="contained"
        >
          Create reservation
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
