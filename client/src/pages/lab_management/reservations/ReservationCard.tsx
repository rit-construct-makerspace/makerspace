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
import Reservation, {ReservationStatus} from "../../../types/Reservation";
import { format } from "date-fns";
import {
  GET_RESERVATION_IDS_PER_EXPERT,
  SET_RESERVATION_CANCELLED,
  SET_RESERVATION_CONFIRMED
} from "../../../queries/reservationQueries";
import {useMutation} from "@apollo/client";
import {CREATE_ANNOUNCEMENT} from "../../../queries/announcementsQueries";

interface ReservationCardProps {
  reservation: Reservation;
  onActionComplete: () => void;
}

function formatReservationTime(reservation: Reservation) {
  const startDate = new Date(reservation.startTime);
  const endDate = new Date(reservation.endTime);

  const formattedDate = format(startDate, "EEEE, MMM do");

  const startTime = format(startDate, "h:mm");
  const endTime = format(endDate, "h:mm");

  let startPeriod = format(startDate, "a ");
  const endPeriod = format(endDate, "a ");

  // If both times are in AM, remove the first "AM". Same for PM.
  if (startPeriod === endPeriod) {
    startPeriod = "";
  }

  return `${formattedDate}, ${startTime} ${startPeriod}— ${endTime} ${endPeriod}`;
}



export default function ReservationCard({ reservation, onActionComplete }: ReservationCardProps) {
  const [CancelRes, mutationCan] = useMutation(SET_RESERVATION_CANCELLED);
  const [ConfirmRes, mutationCon] = useMutation(SET_RESERVATION_CONFIRMED);
  const handleConfirm = async (id: number) => {
    await ConfirmRes({variables:{resID: id}})
    onActionComplete()
  }

  const handleCancel = async (id: number) => {
    await CancelRes({variables:{resID: id}})
    onActionComplete()
  }
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
        <Button onClick={()=>{console.log()}}>YO</Button>
        {reservation.status === "PENDING" &&
          (
            <>
              <Button onClick={()=>{handleCancel(reservation.id)}}>Cancel</Button>
              <Button variant="contained" onClick={()=>{handleConfirm(reservation.id)}}>Confirm</Button>
            </>
          )
        }
      </Stack>
    </Card>
  );
}
