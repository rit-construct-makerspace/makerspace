import { Button, Card, CardContent, CardMedia, Grid, Stack, Typography } from "@mui/material";
import Page from "../../Page";

export default function EquipmentPage() {

  return (
    <Page title="">
        <Card sx={{ width: 250 }}>
        <CardMedia
            component="img"
            height="150"
            image="https://localhost:3000/app/favicon.ico"
          />
        <CardContent>
            <Typography
              variant="h1"
              component="div"
              sx={{ lineHeight: 1, mb: 1 }}
            >
              Session Ended
            </Typography>
            <Typography
              variant="h1"
              component="div"
              sx={{ lineHeight: 1, mb: 1 }}
            >
              Close browser to fully logout
            </Typography>
          </CardContent>
      </Card>
    </Page>
);
}
