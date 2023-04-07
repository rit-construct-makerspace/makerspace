import { useCallback } from "react";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import HandymanIcon from "@mui/icons-material/Handyman";
import InventoryIcon from "@mui/icons-material/Inventory";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import Avatar from "@mui/material/Avatar";
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Typography from "@mui/material/Typography";
import NavLink from "./NavLink";
import LogoSvg from "../assets/logo.svg";
import styled from "styled-components";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useCurrentUser } from "../common/CurrentUserProvider";
import Privilege from "../types/Privilege";
import { Outlet } from "react-router-dom";
import { Stack, Button, Box } from "@mui/material";
import HoldAlert from "./HoldAlert";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StyledLogo = styled.img`
  margin: 20px 12px 12px 12px;
  &:hover {
    cursor: pointer;
  }
`;

const drawerWidth = 250;

export default function LeftNav() {
  const currentUser = useCurrentUser();
  const isMaker = currentUser.privilege === Privilege.MAKER;
  const navigate = useNavigate();

  const logout = useCallback(() => {
    console.log("Logging out...")
    fetch(process.env.LOGOUT_URL ?? "https://localhost:3000/logout", {
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      redirect: 'follow'
    })
    .catch(function(err) {
        console.info(err);
    });
  }, []);

  return (
    <Box display="flex">
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <StyledLogo src={LogoSvg} alt="Construct logo" onClick={() => navigate(`/`)} />

        <Stack direction="row" alignItems="center" spacing={2} padding={2}>
          <Avatar
            alt="Profile picture"
            src="https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
          />
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {`${currentUser.firstName} ${currentUser.lastName}`}
          </Typography>
          <Button
            variant="contained"
            onClick={logout}>
            Logout
          </Button>
        </Stack>

        {currentUser.hasHolds && <HoldAlert />}

        <List component="nav">
          {!isMaker && <Divider textAlign="left">MAKER</Divider>}
          <NavLink
            to="/maker/equipment"
            primary="Equipment"
            icon={<HandymanIcon />}
          />
          <NavLink
            to="/maker/training"
            primary="Training"
            icon={<SchoolIcon />}
          />
          <NavLink
            to="/maker/materials"
            primary="Materials"
            icon={<InventoryIcon />}
          />
        </List>

        {!isMaker && (
          <List component="nav">
            <Divider textAlign="left">STAFF</Divider>
            <NavLink
              to="/admin/equipment"
              primary="Equipment"
              icon={<HandymanIcon />}
            />
            <NavLink
              to="/admin/training"
              primary="Training"
              icon={<SchoolIcon />}
            />
            <NavLink
              to="/admin/inventory"
              primary="Materials"
              icon={<InventoryIcon />}
            />
            <NavLink
              to="/admin/storefront"
              primary="Storefront"
              icon={<StorefrontIcon />}
            />
            <NavLink
              to="/admin/rooms"
              primary="Rooms"
              icon={<MeetingRoomIcon />}
            />
            <NavLink
              to="/admin/reservations"
              primary="Reservations"
              icon={<EventIcon />}
            />
            <NavLink
              to="/admin/announcements"
              primary="Announcements"
              icon={<AnnouncementIcon />}
            />
            <NavLink
              to="/admin/people"
              primary="People"
              icon={<PeopleIcon />}
            />
            <NavLink
              to="/admin/history"
              primary="History"
              icon={<HistoryIcon />}
            />
          </List>
        )}
      </Drawer>
      <Outlet />
    </Box>
  );
}

