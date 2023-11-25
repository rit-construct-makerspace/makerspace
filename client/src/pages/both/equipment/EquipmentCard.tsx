import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

interface EquipmentCardProps {
  id: number;
  name: string;
  to: string;
  pictureURL: string;
}

export default function EquipmentCard({ id, name, to, pictureURL}: EquipmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(to)}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="150"
          image={pictureURL}
        />
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{ lineHeight: 1, mb: 1 }}
            noWrap
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
