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
  imageUrl: string;
}

export default function EquipmentCard({ id, name, to, imageUrl }: EquipmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: 250, height: 300 }} onClick={() => navigate(to)}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="150"
          image={imageUrl}
        />
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            minHeight="120"
            sx={{ lineHeight: 1, mb: 1 }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
