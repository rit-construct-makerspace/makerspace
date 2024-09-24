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
import AdfScannerIcon from '@mui/icons-material/AdfScanner';
import Typography from "@mui/material/Typography";
import NavLink from "./NavLink";
import LogoSvg from "../assets/acronym_logo.svg";
import styled from "styled-components";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useCurrentUser } from "../common/CurrentUserProvider";
import Privilege from "../types/Privilege";
import { Outlet } from "react-router-dom";
import {Stack, Box, Button, IconButton} from "@mui/material";
import HoldAlert from "./HoldAlert";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PrinterOsIcon from "../common/PrinterOSIcon";
import SlackIcon from "../common/SlackIcon";
import { useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import RequestWrapper from "../common/RequestWrapper";
import { gql, useQuery } from "@apollo/client";
import BarChartIcon from '@mui/icons-material/BarChart';

const StyledLogo = styled.img`
  margin: 20px 12px 12px 12px;
  &:hover {
    cursor: pointer;
  }
`;

const IS_MENTOR_OR_HIGHER = gql`
  query IsMentorOrHigher {
    isMentorOrHigher
  }
`;

const drawerWidth = 250;

export default function LeftNav() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const currentUser = useCurrentUser();
  const isMaker = currentUser.privilege === Privilege.MAKER;
  const navigate = useNavigate();

  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);
  const isMobile = width <= 768;


  const isMentorOrHigherResult = useQuery(IS_MENTOR_OR_HIGHER);

  const drawerContent = (
    <>
      <StyledLogo src={LogoSvg} alt="SHED logo" onClick={() => navigate(`/`)} />

      <Stack direction="row" alignItems="center" spacing={2} padding={2}>
        <Avatar
          alt="Profile picture"
          src="https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
        />
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {`${currentUser.firstName} ${currentUser.lastName}`}
        </Typography>
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
        {/*<NavLink
          to="/maker/materials"
          primary="Materials"
          icon={<InventoryIcon />}
        />*/}
        <NavLink
          to="https://cloud.3dprinteros.com/ssosaml/rit/auth"
          primary="3DPrinterOS"
          icon={<PrinterOsIcon />}
        />
        <NavLink
          to="https://rit.enterprise.slack.com/archives/C0440KNF916"
          primary="Slack"
          icon={<SlackIcon />}
        />
      </List>

        {!isMaker && (
          <RequestWrapper loading={isMentorOrHigherResult.loading} error={isMentorOrHigherResult.error}>
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
              <NavLink
                to="/admin/readers"
                primary="Access Devices"
                icon={<AdfScannerIcon />}
              />
              <NavLink
                to="/admin/statistics"
                primary="Statistics"
                icon={<BarChartIcon />}
              />
            </List>
          </RequestWrapper>
        )}
      
      
        {/*Logout Button*/}
      <List component={"nav"}>
        <NavLink
            to="/logoutprompt"
            primary="Logout"
            icon={<HandymanIcon />}
        />
      </List>
    </>
  );

  return (
    <Box display={!isMobile ? "flex" : "block"}>
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
      <IconButton onClick={toggleDrawer(true)} sx={{position: "static", height: 20, width: 20, p: 3, background:"none"}}><MenuIcon /></IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
      <Outlet />
    </Box>
  );
}

