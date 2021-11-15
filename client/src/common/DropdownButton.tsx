import React, { MouseEvent, ReactNode, useState } from "react";
import {
  Button,
  ButtonGroup,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface DropdownButtonItem {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

interface DropdownButtonProps {
  children: ReactNode;
  onClick: () => void;
  items: DropdownButtonItem[];
}

export default function DropdownButton({
  children,
  onClick,
  items,
}: DropdownButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();

  const closeMenu = () => setAnchorEl(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  return (
    <>
      <ButtonGroup>
        <Button onClick={onClick}>{children}</Button>
        <Button aria-label="More options" onClick={handleClick}>
          <ExpandMoreIcon sx={{ mx: -2 }} />
        </Button>
      </ButtonGroup>

      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={closeMenu}>
        {items.map((item) => (
          <MenuItem onClick={item.onClick} key={item.label}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
