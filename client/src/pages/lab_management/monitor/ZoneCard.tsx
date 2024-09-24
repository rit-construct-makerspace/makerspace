import React from "react";
import { Button, Card, CardActionArea, CardContent, CardMedia, Stack, Typography, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Room from "../../../types/Room";
import { gql, useMutation } from "@apollo/client";
import { GET_ZONES } from "../../../queries/getZones";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Privilege from "../../../types/Privilege";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoneHourOptions from "./ZoneHourOptions";

const DELETE_ZONE = gql`
  mutation DeleteZone($id: ID!) {
    deleteZone(id: $id) {
      id
    }
  }
`;

interface ZoneCardProps {
  id: number,
  name: string
}

export default function ZoneCard({ id, name }: ZoneCardProps) {
  const currentUser = useCurrentUser();

  const [deleteZone] = useMutation(DELETE_ZONE);

  const handleDeleteZone = () => {
    const confirm = window.confirm("Are you sure you want to delete? This cannot be undone.");
    if (confirm)
    deleteZone({
      variables: { id },
      refetchQueries: [{ query: GET_ZONES }],
    });
  };

  return (
    <Card sx={{ width: 800, mr: 2, mb: 2 }}>
      <CardContent>
        <Stack direction={"row"} spacing={2} sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <Typography variant="h6" component="div" color={"darkgray"}>
            {name}
          </Typography>
          <Stack direction={"row"} spacing={1} sx={{display:"flex", justifyContent:"flex-end", alignItems:"center"}}>
            {currentUser.privilege === Privilege.STAFF &&
              <Button
                variant="text"
                color="error"
                onClick={handleDeleteZone}
              ><DeleteIcon /></Button>
            }
            <Typography variant="body2" component="div" color={"darkgray"}>
              {"ID " + id}
            </Typography>
          </Stack>
        </Stack>

        <ZoneHourOptions zoneID={id} />
      </CardContent>
    </Card>
  );
}
