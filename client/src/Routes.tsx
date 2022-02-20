import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import StorefrontPreviewPage from "./pages/admin/storefront_preview/StorefrontPreviewPage";
import { Box } from "@mui/material";
import LeftNav from "./left_nav/LeftNav";
import CreateReservationPage from "./pages/maker/create_reservation/CreateReservationPage";
import EditModulePage from "./pages/admin/edit_module/EditModulePage";
import EquipmentPage from "./pages/both/equipment/EquipmentPage";
import EditEquipmentPage from "./pages/admin/edit_equipment/EditEquipmentPage";
import TrainingModulesPage from "./pages/admin/training_modules/TrainingModulesPage";
import InventoryPage from "./pages/admin/inventory/InventoryPage";
import SelectRoomPage from "./pages/admin/monitor/SelectRoomPage";
import MonitorRoomPage from "./pages/admin/monitor/MonitorRoomPage";
import StorefrontPage from "./pages/admin/storefront/StorefrontPage";
import TrainingPage from "./pages/maker/training/TrainingPage";
import UsersPage from "./pages/admin/users/UsersPage";
import CreatePurchaseOrderPage from "./pages/admin/create_purchase_order/CreatePurchaseOrderPage";
import ManageUserPage from "./pages/admin/manage_user/ManageUserPage";
import AuditLogsPage from "./pages/admin/audit_logs/AuditLogsPage";
import ReservationsPage from "./pages/admin/reservations/ReservationsPage";
import InventoryPreviewPage from "./pages/maker/inventory_preview/InventoryPreviewPage";
import MaterialPage from "./pages/admin/edit_material/MaterialPage";

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
              <InventoryPreviewPage />
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
              <MaterialPage />
            </Route>

            <Route path="/admin/inventory">
              <InventoryPage />
            </Route>

            <Route path="/admin/create-purchase-order">
              <CreatePurchaseOrderPage />
            </Route>

            <Route path="/admin/reservations">
              <ReservationsPage />
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

            <Route path="/admin/manage-user">
              <ManageUserPage />
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
