import React, { forwardRef, useMemo, useState } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box, Chip, FormControl, InputLabel, ListItemButton, Stack, Switch, Typography } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';


export default function ThemeToggle() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(localStorage.getItem("themeMode") == "dark")

  return (
    <ListItemButton sx={{height: "4em"}} onClick={(e) => {
      setMode(!mode);
      localStorage.setItem("themeMode", mode ? "light" : "dark");
      window.location.reload();
    }}>
    <ListItemIcon><DarkModeIcon /></ListItemIcon>
      <Stack direction={"row"}>
        <Typography>
          Dark Mode (Experimental)
        </Typography>
        <br />
        <Switch id="theme-toggle" aria-label="Dark Mode (Experimental)" checked={mode} onChange={(e) => {
          setMode(!mode);
          localStorage.setItem("themeMode", mode ? "light" : "dark");
          window.location.reload();
        }}/>
      </Stack>
    </ListItemButton>
);
}
