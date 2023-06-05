import { Route, Routes } from "react-router-dom";
import StorefrontPreviewPage from "./pages/lab_management/storefront_preview/StorefrontPreviewPage";
import LeftNav from "./left_nav/LeftNav";
import CreateReservationPage from "./pages/maker/create_reservation/CreateReservationPage";
import EquipmentPage from "./pages/both/equipment/EquipmentPage";
import EditEquipmentPage from "./pages/lab_management/manage_equipment/EditEquipmentPage";
import TrainingModulesPage from "./pages/lab_management/training_modules/TrainingModulesPage";
import InventoryPage from "./pages/lab_management/inventory/InventoryPage";
import SelectRoomPage from "./pages/lab_management/monitor/SelectRoomPage";
import MonitorRoomPage from "./pages/lab_management/monitor/MonitorRoomPage";
import StorefrontPage from "./pages/lab_management/storefront/StorefrontPage";
import TrainingPage from "./pages/maker/training/TrainingPage";
import UsersPage from "./pages/lab_management/users/UsersPage";
import AuditLogsPage from "./pages/lab_management/audit_logs/AuditLogsPage";
import ReservationsPage from "./pages/lab_management/reservations/ReservationsPage";
import InventoryPreviewPage from "./pages/maker/inventory_preview/InventoryPreviewPage";
import SignupPage from "./pages/maker/signup/SignupPage";
import QuizPage from "./pages/maker/take_quiz/QuizPage";
import QuizResults from "./pages/maker/take_quiz/QuizResults";
import Homepage from "./pages/both/homepage/Homepage";
import AnnouncementsPage from "./pages/lab_management/announcements/AnnouncementsPage";
import EditAnnouncementSample from "./pages/lab_management/announcements/EditAnnouncementPage_sample";
import ManageEquipmentPage from "./pages/lab_management/manage_equipment/ManageEquipmentPage";
import NotFoundPage from "./pages/NotFoundPage";
import EditActiveModulePage from "./pages/lab_management/edit_module/EditActiveModulePage";
import EditArchivedModulePage from "./pages/lab_management/edit_module/EditArchivedModulePage";
import LogoutPromptPage from "./pages/both/logout/LogoutPromptPage";

// This is where we map the browser's URL to a
// React component with the help of React Router.

export default function AppRoutes() {
  return (
    <div className="app">

    <Routes>

        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/admin/storefront/preview"
          element={<StorefrontPreviewPage />}
        />

        <Route path={"/"} element={<LeftNav />}>
          <Route path="/" element={<Homepage />} />

          <Route path="/create-reservation" element={<CreateReservationPage />} />2

          <Route
            path="/maker/equipment"
            element={<EquipmentPage />}
          />

          <Route
            path="/maker/equipment/:id"
            element={<EquipmentPage />}
          />

          <Route path="/maker/training" element={<TrainingPage />} />

          <Route path="/maker/training/:id" element={<QuizPage />} />

          <Route path="maker/training/:id/results" element={<QuizResults />} />

          <Route path="/maker/materials" element={<InventoryPreviewPage />} />

          <Route
            path="/admin/equipment"
            element={<ManageEquipmentPage />}
          />

          <Route path="/admin/equipment/:id" element={<EditEquipmentPage archived={false} />} />

          <Route path="/admin/equipment/archived/:id" element={<EditEquipmentPage archived={true} />} />

          <Route path="/admin/training" element={<TrainingModulesPage />} />

          <Route path="/admin/training/:id" element={<EditActiveModulePage />} />

          <Route path="/admin/training/archived/:id" element={<EditArchivedModulePage />} />

          <Route path="/admin/inventory" element={<InventoryPage />} />

          <Route path="/admin/reservations" element={<ReservationsPage />} />

          <Route path="/admin/rooms/:id" element={<MonitorRoomPage />} />

          <Route path="/admin/rooms" element={<SelectRoomPage />} />

          <Route path="/admin/storefront" element={<StorefrontPage />} />

          <Route path="/admin/people/:id" element={<UsersPage />} />

          <Route path="/admin/people" element={<UsersPage />} />

          <Route path="/admin/announcements" element={<AnnouncementsPage />} />

          <Route path="/admin/announcements/sample" element={<EditAnnouncementSample />} />

          <Route path="/admin/history" element={<AuditLogsPage />} />

          <Route path="/logoutprompt" element={<LogoutPromptPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
    </Routes>
    </div>
  );
}
