import * as React from "react";
import LeftNav from "./left_nav/LeftNav";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Page from "./pages/Page";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import MakerEquipmentPage from "./pages/maker/MakerEquipmentPage";
import CreateReservationPage from "./pages/maker/create_reservation/CreateReservationPage";
import QuizBuilderPage from "./pages/admin/quiz_builder/QuizBuilderPage";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          <LeftNav />
          <Switch>
            <Route path="/create-reservation">
              <CreateReservationPage />
            </Route>
            <Route path="/quiz-builder">
              <QuizBuilderPage />
            </Route>
            <Route path="/maker/equipment">
              <MakerEquipmentPage />
            </Route>
            <Route path="/maker/training">
              <Page title="Training" />
            </Route>
            <Route path="/maker/materials">
              <Page title="Materials" />
            </Route>
            <Route path="/admin/equipment">
              <Page title="Equipment" />
            </Route>
            <Route path="/admin/training">
              <Page title="Training" />
            </Route>
            <Route path="/admin/materials">
              <Page title="Materials" />
            </Route>
            <Route path="/admin/reservations">
              <Page title="Reservations" />
            </Route>
            <Route path="/admin/storefront">
              <Page title="Storefront" />
            </Route>
            <Route path="/admin/people">
              <Page title="People" />
            </Route>
            <Route path="/admin/audit">
              <Page title="Audit Logs" />
            </Route>
          </Switch>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
