import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import ActionButton from "../../../common/ActionButton";
import SopButton from "../../../common/SopButton";

interface EquipmentCardProps {
  id: number;
  name: string;
  to: string;
  imageUrl: string;
  sopUrl: string;
}

export default function EquipmentCard({ id, name, to, imageUrl, sopUrl }: EquipmentCardProps) {
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
        <CardActions
          sx={{
            minHeight: 0.12,
            justifyContent: "space-between",
            flexDirection: "row-reverse",
            mt: 0,
            padding: 0.25
          }}>
          {
            sopUrl && sopUrl != ""
              ? <SopButton appearance="icon-only" url={sopUrl} disabled={false} toolTipText="View SOP" buttonText="View SOP"></SopButton>
              : <SopButton appearance="icon-only" url={sopUrl} disabled={true} toolTipText="No SOP" buttonText="No SOP"></SopButton>
          }
        </CardActions>
      </CardActionArea>
    </Card>
  );
}
