import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import StorefrontPreviewPage from "./pages/admin/storefront_preview/StorefrontPreviewPage";
import { Box } from "@mui/material";
import LeftNav from "./left_nav/LeftNav";
import CreateReservationPage from "./pages/maker/create_reservation/CreateReservationPage";
import EditModulePage from "./pages/admin/edit_module/EditModulePage";
import EquipmentPage from "./pages/both/equipment/EquipmentPage";
import Page from "./pages/Page";
import EditEquipmentPage from "./pages/admin/edit_equipment/EditEquipmentPage";
import TrainingModulesPage from "./pages/admin/training_modules/TrainingModulesPage";
import EditMaterialPage from "./pages/admin/edit_material/EditMaterialPage";
import InventoryPage from "./pages/admin/inventory/InventoryPage";
import SelectRoomPage from "./pages/admin/monitor/SelectRoomPage";
import MonitorRoomPage from "./pages/admin/monitor/MonitorRoomPage";
import StorefrontPage from "./pages/admin/storefront/StorefrontPage";
import TrainingPage from "./pages/maker/training/TrainingPage";
import UsersPage from "./pages/admin/users/UsersPage";
import AuditLogsPage from "./pages/admin/audit_logs/AuditLogsPage"

// This is where we map the browser's URL to a
// React component with the help of React Router.

export default function Routes() {
  return (
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
              <TrainingPage />
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
              <UsersPage />
            </Route>

            <Route path="/admin/audit">
              <AuditLogsPage />
            </Route>
          </Switch>
        </Box>
      </Switch>
    </BrowserRouter>
  );
}
