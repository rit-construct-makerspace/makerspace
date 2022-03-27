import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

interface MachineCardProps {
  name: string;
  to: string;
}

export default function EquipmentCard({ name, to }: MachineCardProps) {
  const navigate = useNavigate();

  return (
    <Grid item onClick={() => navigate(to)}>
      <Card sx={{ width: 250 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="150"
            image="https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp"
          />
          <CardContent>
            <Typography
              variant="h6"
              component="div"
              sx={{ lineHeight: 1, mb: 1 }}
            >
              {name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
