import React, { ChangeEvent, useState } from "react";
import {
  Alert,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Privilege from "../../../types/Privilege";
import { gql, useMutation, useQuery } from "@apollo/client";
import GET_USERS from "../../../queries/getUsers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoadingButton from "@mui/lab/LoadingButton";
import { InputLabel } from "@mui/material";


const SET_ROOM_ZONE = gql`
  mutation setZone($roomID: ID!, $zoneID: ID!) {
    setZone(roomID: $roomID, zoneID: $zoneID) {
      id
    }
  }
`;

const GET_ZONES = gql`
  query getZones {
    zones {
      id
      name
    }
  }
`;

interface RoomZoneAssociationProps {
  roomID: number
  zoneID: number;
}


export default function RoomZoneAssociation({
  roomID,
  zoneID,
}: RoomZoneAssociationProps) {
  const currentUser = useCurrentUser();
  const getZonesResult = useQuery(GET_ZONES);
  const [setNewZone, setNewZoneResult] = useMutation(SET_ROOM_ZONE);
  
  const [updatedZoneID, setUpdatedZoneID] = useState(zoneID);

  const isAdmin = currentUser.privilege === Privilege.STAFF;

  const handleSubmit = () => {
    setNewZone({
      variables: {
        roomID: roomID,
        zoneID: updatedZoneID
      }
    });
  };

  return (
    <>
      <FormControl disabled={!isAdmin || setNewZoneResult.loading}>
        <InputLabel sx={{fontWeight:"bold", color: "black"}} id="update-zone-label">Zone</InputLabel>
        <Select
          value={updatedZoneID}
          id="update-zone-label"
          label="Zone"
          onChange={(e) => setUpdatedZoneID(Number(e.target.value))}
        >
          {getZonesResult.data != null && getZonesResult.data.zones.map((zone: {id: number, name: string}) => (
            <MenuItem selected={zone.id === zoneID} value={zone.id}>{zone.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <LoadingButton
        loading={setNewZoneResult.loading}
        size="large"
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 8, alignSelf: "flex-end" }}
      >
        Update Zone
      </LoadingButton>
      
      {!isAdmin && (
        <Alert severity="info" sx={{ width: "max-content", mt: 1 }}>
          You do not have permission to change this.
        </Alert>
      )}
    </>
  );
}