import * as React from "react";
import LeftNav from "./left_nav/LeftNav";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Page from "./pages/Page";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import EquipmentPage from "./pages/both/EquipmentPage";
import CreateReservationPage from "./pages/maker/create_reservation/CreateReservationPage";
import TrainingModulesPage from "./pages/admin/training_modules/TrainingModulesPage";
import EditModulePage from "./pages/admin/edit_module/EditModulePage";
import EditEquipmentPage from "./pages/admin/edit_equipment/EditEquipmentPage";
import SelectRoomPage from "./pages/admin/monitor/SelectRoomPage";
import MonitorRoomPage from "./pages/admin/monitor/MonitorRoomPage";
import StorefrontPage from "./pages/admin/storefront/StorefrontPage";
import StorefrontPreviewPage from "./pages/admin/storefront_preview/StorefrontPreviewPage";
import InventoryPage from "./pages/admin/inventory/InventoryPage";
import EditMaterialPage from "./pages/admin/edit_material/EditMaterialPage";
import AuditLogsPage from "./pages/admin/audit_logs/AuditLogsPage";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL ?? "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

const theme = createTheme();

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/admin/storefront/preview">
              <StorefrontPreviewPage />
            </Route>

            <Box sx={{ display: "flex" }}>
              <LeftNav />

              <Switch>
                <Route path="/create-reservation">
                  <CreateReservationPage />
                </Route>

                <Route path="/quiz-builder">
                  <EditModulePage />
                </Route>

                <Route path="/maker/equipment">
                  <EquipmentPage isAdmin={false} />
                </Route>

                <Route path="/maker/training">
                  <Page title="Training" />
                </Route>

                <Route path="/maker/materials">
                  <Page title="Materials" />
                </Route>

                <Route path="/admin/edit-equipment">
                  <EditEquipmentPage />
                </Route>

                <Route path="/admin/equipment">
                  <EquipmentPage isAdmin={true} />
                </Route>

                <Route path="/admin/training">
                  <TrainingModulesPage />
                </Route>

                <Route path="/admin/inventory/:id">
                  <EditMaterialPage />
                </Route>

                <Route path="/admin/inventory">
                  <InventoryPage />
                </Route>

                <Route path="/admin/reservations">
                  <Page title="Reservations" />
                </Route>

                <Route path="/admin/monitor/select-room">
                  <SelectRoomPage />
                </Route>

                <Route path="/admin/monitor/sample-room">
                  <MonitorRoomPage />
                </Route>

                <Route path="/admin/storefront">
                  <StorefrontPage />
                </Route>

                <Route path="/admin/people">
                  <Page title="People" />
                </Route>

                <Route path="/admin/audit">
                  <AuditLogsPage />
                </Route>
              </Switch>
            </Box>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}
