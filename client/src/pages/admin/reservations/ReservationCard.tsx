import React from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReservationAttachment from "./ReservationAttachment";
import Reservation from "../../../types/Reservation";

interface ReservationCardProps {
  reservation: Reservation;
}

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan.",
  "Feb.",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];

function formatDate(dateTime: string) {
  const d = new Date(dateTime);
  return `${weekdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function formatTime(dateTime: string) {
  const d = new Date(dateTime);
  return d.toLocaleTimeString().replaceAll(":00", "");
}

// '11:30 AM' -> 'AM'
function getTimePeriod(time: string) {
  return time.substring(time.length - 2);
}

function formatReservationTime(reservation: Reservation) {
  const date = formatDate(reservation.startTime);

  const startTime = formatTime(reservation.startTime);
  const endTime = formatTime(reservation.endTime);

  const fullTime = `${date}, ${startTime} — ${endTime}`;

  const startPeriod = getTimePeriod(startTime);
  const endPeriod = getTimePeriod(endTime);

  // If both times are in AM, remove the first "AM". Same for PM.
  if (startPeriod === endPeriod) {
    return fullTime.replace(startPeriod, "");
  }

  return fullTime;
}

export default function ReservationCard({ reservation }: ReservationCardProps) {
  return (
    <Card sx={{ width: 400 }}>
      <CardMedia
        component="img"
        height="140"
        alt=""
        image={reservation.equipment.image}
      />
      <Stack direction="row" alignItems="flex-end" spacing={1}>
        <Avatar
          alt={`${reservation.maker.name}'s profile picture`}
          src={reservation.maker.image}
          sx={{
            width: 100,
            height: 100,
            ml: 1,
            mt: "-60px",
            border: "4px solid white",
          }}
        />
        <Typography variant="h6">{reservation.maker.name}</Typography>
      </Stack>

      <Stack sx={{ ml: 2, mt: 2 }}>
        <Typography variant="body1">{reservation.equipment.name}</Typography>
        <Typography variant="body1">
          {formatReservationTime(reservation)}
        </Typography>
      </Stack>

      <Alert
        severity="info"
        icon={<ChatBubbleOutlineIcon fontSize="small" />}
        sx={{ m: 2 }}
      >
        {reservation.comment}
      </Alert>

      <Stack spacing={0.5} sx={{ mx: 2 }}>
        {reservation.attachments.map((attachment) => (
          <ReservationAttachment name={attachment.name} key={attachment.url} />
        ))}
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        sx={{ m: 2 }}
      >
        <Button>Cancel</Button>
        <Button variant="contained">Confirm</Button>
      </Stack>
    </Card>
  );
}
