import React from "react";
import { Route, Routes } from "react-router-dom";
import StorefrontPreviewPage from "./pages/admin/storefront_preview/StorefrontPreviewPage";
import LeftNav from "./left_nav/LeftNav";
import CreateReservationPage from "./pages/maker/create_reservation/CreateReservationPage";
import EditModulePage from "./pages/admin/edit_module/EditModulePage";
import EquipmentPage from "./pages/both/equipment/EquipmentPage";
import ManageEquipmentPage from "./pages/admin/manage_equipment/ManageEquipmentPage";
import TrainingModulesPage from "./pages/admin/training_modules/TrainingModulesPage";
import InventoryPage from "./pages/admin/inventory/InventoryPage";
import SelectRoomPage from "./pages/admin/monitor/SelectRoomPage";
import MonitorRoomPage from "./pages/admin/monitor/MonitorRoomPage";
import StorefrontPage from "./pages/admin/storefront/StorefrontPage";
import TrainingPage from "./pages/maker/training/TrainingPage";
import UsersPage from "./pages/admin/users/UsersPage";
import AuditLogsPage from "./pages/admin/audit_logs/AuditLogsPage";
import ReservationsPage from "./pages/admin/reservations/ReservationsPage";
import InventoryPreviewPage from "./pages/maker/inventory_preview/InventoryPreviewPage";
import SignupPage from "./pages/maker/signup/SignupPage";

// This is where we map the browser's URL to a
// React component with the help of React Router.

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/admin/storefront/preview"
        element={<StorefrontPreviewPage />}
      />

      <Route path={"/"} element={<LeftNav />}>
        <Route path="/create-reservation" element={<CreateReservationPage />} />

        <Route
          path="/maker/equipment"
          element={<EquipmentPage isAdmin={false} />}
        />

        <Route path="/maker/training" element={<TrainingPage />} />

        <Route path="/maker/materials" element={<InventoryPreviewPage />} />

        <Route path="/admin/equipment/:id" element={<ManageEquipmentPage />} />

        <Route
          path="/admin/equipment"
          element={<EquipmentPage isAdmin={true} />}
        />

        <Route path="/admin/training/:id" element={<EditModulePage />} />

        <Route path="/admin/training" element={<TrainingModulesPage />} />

        <Route path="/admin/inventory" element={<InventoryPage />} />

        <Route path="/admin/reservations" element={<ReservationsPage />} />

        <Route path="/admin/rooms/:id" element={<MonitorRoomPage />} />

        <Route path="/admin/rooms" element={<SelectRoomPage />} />

        <Route path="/admin/storefront" element={<StorefrontPage />} />

        <Route path="/admin/people/:id" element={<UsersPage />} />

        <Route path="/admin/people" element={<UsersPage />} />

        <Route path="/admin/history" element={<AuditLogsPage />} />
      </Route>
    </Routes>
  );
}
