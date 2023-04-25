import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Tooltip
} from "@mui/material";
import PublishEquipmentButton from "./PublishEquipmentButton";
import ArchiveEquipmentButton from "./ArchiveEquipmentButton";

interface ArchivedEquipmentCardProps {
  id: number;
  name: string;
  to: string;
  archived: boolean;
}

export default function EditableEquipmentCard({ id, name, to, archived }: ArchivedEquipmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: 250 }}>
      <Tooltip title={name} followCursor>
        <CardActionArea onClick={() => navigate(to)}>
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
                noWrap
              >
                {name}
              </Typography>
          </CardContent>
        </CardActionArea>
      </Tooltip>
        <CardActions
          sx={{
            minHeight: 0.12,
            justifyContent: "flex-end",
            mt: 0,
            padding: 0.25
          }}>
              {
                archived
                  ? <PublishEquipmentButton equipmentID={id} appearance="icon-only" />
                  : <ArchiveEquipmentButton equipmentID={id} appearance="icon-only" />
              }
        </CardActions>
      </Card>
  );
}
