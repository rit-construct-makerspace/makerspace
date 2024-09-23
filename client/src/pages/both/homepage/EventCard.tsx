import {
  Button,
  Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia,
  Typography
} from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface EventCardProps {
  name: string;
  description: string;
  summary: string;
  url: string;
  start: string;
  end: string;
  logoUrl: string;
}

export default function EventCard(props: EventCardProps) {
  const startDate = new Date(props.start);
  const endDate = new Date(props.end);

  return (
    <Card sx={{width: '100%', mx: 0, my: 2}}>
      <CardActionArea onClick={() => {window.location.href = props.url;}}>
        <CardHeader title={props.name} subheader={`${format(startDate, "MMM do, h:mm bb")} - ${format(endDate, "MMM do, h:mm bb")}`} sx={{"h5": {fontSize: '2em'}}}></CardHeader>
        {/* <CardMedia
          component="img"
          height="194"
          image={props.logoUrl}
          alt={props.name + " Event Logo"}
        />
        <CardContent>
          <Typography variant="body2">
            {props.summary}...
          </Typography>
        </CardContent> */}
      </CardActionArea>
    </Card>
  );
}