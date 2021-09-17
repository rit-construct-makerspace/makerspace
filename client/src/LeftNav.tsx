import React, { forwardRef, useMemo } from "react";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Drawer from "@mui/material/Drawer";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  useLocation,
} from "react-router-dom";
import HandymanIcon from "@mui/icons-material/Handyman";
import InventoryIcon from "@mui/icons-material/Inventory";
import EventIcon from "@mui/icons-material/Event";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
}

function ListItemLink({ icon, primary, to }: ListItemLinkProps) {
  const url = useLocation();

  const renderLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, "to">>(
        (itemProps, ref) => (
          <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
        )
      ),
    [to]
  );

  return (
    <ListItem button selected={url.pathname === to} component={renderLink}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItem>
  );
}

export default function LeftNav() {
  return (
    <Box>
      <Drawer variant="permanent" open>
        <Stack direction="row" alignItems="center" spacing={2} padding={2}>
          <Avatar
            alt="matt"
            src="https://avatars.githubusercontent.com/u/20482179?v=4"
          />
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Matt Galan
          </Typography>
        </Stack>

        <List component="nav">
          <Divider textAlign="left">MAKER</Divider>
          <ListItemLink
            to="/maker/equipment"
            primary="Equipment"
            icon={<HandymanIcon />}
          />
          <ListItemLink
            to="/maker/materials"
            primary="Materials"
            icon={<InventoryIcon />}
          />
        </List>
        <List component="nav">
          <Divider textAlign="left">ADMIN</Divider>
          <ListItemLink
            to="/admin/equipment"
            primary="Equipment"
            icon={<HandymanIcon />}
          />
          <ListItemLink
            to="/admin/materials"
            primary="Materials"
            icon={<InventoryIcon />}
          />
          <ListItemLink
            to="/admin/reservations"
            primary="Reservations"
            icon={<EventIcon />}
          />
          <ListItemLink
            to="/admin/storefront"
            primary="Storefront"
            icon={<StorefrontIcon />}
          />
          <ListItemLink
            to="/admin/people"
            primary="People"
            icon={<PeopleIcon />}
          />
          <ListItemLink
            to="/admin/audit"
            primary="Audit Logs"
            icon={<HistoryIcon />}
          />
        </List>
      </Drawer>
    </Box>
  );
}
