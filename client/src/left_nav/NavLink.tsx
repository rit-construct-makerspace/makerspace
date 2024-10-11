import React, { forwardRef, useMemo } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  useLocation,
} from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Chip, ListItemButton } from "@mui/material";

interface NavLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
  notificationCount?: number;
  newTab?: boolean
  toggleDrawer?: () => void;
}

export default function NavLink({
  icon,
  primary,
  to,
  notificationCount,
  newTab,
  toggleDrawer
}: NavLinkProps) {
  const url = useLocation();

  const renderLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, "to">>(
        (itemProps, ref) => (
          <RouterLink to={to} ref={ref} {...itemProps} role={undefined} target={newTab ? "_blank" : ""} rel={newTab ? "noopener noreferrer" : ""}/>
        )
      ),
    [to]
  );

  return (
    <ListItemButton
      selected={url.pathname.includes(to)}
      component={renderLink}
      onClick={() => {
        console.log(toggleDrawer);
        if (toggleDrawer) toggleDrawer();
      }}
    >
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
      {notificationCount && (
        <Chip size="small" color="primary" label={notificationCount} />
      )}
    </ListItemButton>
  );
}
