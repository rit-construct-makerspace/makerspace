import React from "react";
import Person from "../../../types/Person";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import Equipment from "../../../types/Equipment";

interface EquipmentQualificationsCardProps {
  equipment: Equipment;
  qualifiedPeople: Person[];
  unqualifiedPeople: Person[];
}

export default function EquipmentQualificationsCard({
  equipment,
  qualifiedPeople,
  unqualifiedPeople,
}: EquipmentQualificationsCardProps) {
  return (
    <Card sx={{ width: 300 }}>
      <CardMedia component="img" src={equipment.image} height="150" />
      <CardContent>
        <Typography variant="h6" component="div">
          {equipment.name}
        </Typography>
        <Typography variant="overline" component="div">
          Qualified
        </Typography>
        <Stack direction="row" spacing={1}>
          {qualifiedPeople.map((p) => (
            <Avatar src={p.avatarHref} />
          ))}
        </Stack>

        <Typography variant="overline" component="div" mt={2}>
          Unqualified
        </Typography>

        <Stack direction="row" spacing={1}>
          {unqualifiedPeople.map((p) => (
            <Avatar src={p.avatarHref} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
