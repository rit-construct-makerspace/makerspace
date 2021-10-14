import React from "react";
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
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HoldAlert from "./HoldAlert";
import NavLink from "./NavLink";
import LogoSvg from "../assets/logo.svg";
import styled from "styled-components";

const StyledLogo = styled.img`
  margin: 20px 12px 12px 12px;
`;

const drawerWidth = 250;

export default function LeftNav() {
  return (
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
      <StyledLogo src={LogoSvg} alt="" />

      <Stack direction="row" alignItems="center" spacing={2} padding={2}>
        <Avatar
          alt="matt"
          src="https://avatars.githubusercontent.com/u/20482179?v=4"
        />
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Matt Galan
        </Typography>
      </Stack>

      {false && <HoldAlert />}

      <List component="nav">
        <Divider textAlign="left">MAKER</Divider>
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
      <List component="nav">
        <Divider textAlign="left">ADMIN</Divider>
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
          to="/admin/materials"
          primary="Materials"
          icon={<InventoryIcon />}
        />
        <NavLink
          to="/admin/reservations"
          primary="Reservations"
          icon={<EventIcon />}
          notificationCount={1}
        />
        <NavLink
          to="/admin/storefront"
          primary="Storefront"
          icon={<StorefrontIcon />}
        />
        <NavLink to="/admin/people" primary="People" icon={<PeopleIcon />} />
        <NavLink
          to="/admin/audit"
          primary="Audit Logs"
          icon={<HistoryIcon />}
        />
      </List>
    </Drawer>
  );
}
