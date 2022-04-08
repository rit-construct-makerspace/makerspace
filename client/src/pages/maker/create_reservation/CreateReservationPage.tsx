import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../../Page";
import { gql, useQuery } from "@apollo/client";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import {
  Avatar,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import styled from "styled-components";
import SelectStartStep from "./SelectStartStep";

export interface Timeslot {
  time: string;
  available: string;
}

const GET_EQUIPMENT_AND_TIMESLOTS = gql`
  query GetEquipmentAndTimeslots($equipmentID: ID!) {
    equipment(id: $equipmentID) {
      name
      room {
        name
      }
      timeslots {
        time
        available
      }
    }
  }
`;

export default function CreateReservationPage() {
  const { id } = useParams();
  const result = useQuery(GET_EQUIPMENT_AND_TIMESLOTS, {
    variables: { equipmentID: id },
  });

  const [activeStep, setActiveStep] = useState(0);

  return (
    <RequestWrapper2
      result={result}
      render={({ equipment }) => {
        return (
          <Page title="Create a reservation" maxWidth="600px">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{ width: 60, height: 60 }}
                src="https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp"
              />
              <Stack>
                <Typography variant="h6">{equipment.name}</Typography>
                <Typography>{equipment.room.name}</Typography>
              </Stack>
            </Stack>

            <Stepper activeStep={0} sx={{ mt: 8 }}>
              <Step>
                <StepLabel>Start time</StepLabel>
              </Step>
              <Step>
                <StepLabel>End time</StepLabel>
              </Step>
              <Step>
                <StepLabel>Files & notes</StepLabel>
              </Step>
              <Step>
                <StepLabel>Confirm</StepLabel>
              </Step>
            </Stepper>

            <SelectStartStep timeslots={equipment.timeslots} />
          </Page>
        );
      }}
    />
  );
}
