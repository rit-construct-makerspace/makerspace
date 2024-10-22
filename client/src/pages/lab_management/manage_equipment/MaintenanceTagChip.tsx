import PrettyModal from "../../../common/PrettyModal";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EQUIPMENT_BY_ID } from "../../../queries/equipmentQueries";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { CREATE_MAINTENANCE_TAG, DELETE_MAINTENANCE_TAG, GET_MAINTENANCE_TAGS, MaintenanceTag, UPDATE_MAINTENANCE_TAG } from "../../../queries/maintenanceLogQueries";
import { Box, Chip, IconButton, MenuItem, Select, Stack, TableCell, TableRow, TextField } from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Privilege from "../../../types/Privilege";
import { useState } from "react";
import ActionButton from "../../../common/ActionButton";
import CircleIcon from '@mui/icons-material/Circle';
import CancelIcon from '@mui/icons-material/Cancel';

const CHIP_COLORS: ("default" | "primary" | "secondary" | "warning" | "info" | "error" | "success")[] = ["primary", "secondary", "warning", "info", "error", "success"];

export default function MaintenanceTagChip(props: { id: number, label: string, color: string, removeTag: (id: number) => void}) {

  const [isHover, setIsHover] = useState(false);

  function handleMouseEnter() {
    setIsHover(true)
  }

  function handleMouseLeave() {
    setIsHover(false)
  }

  return (
    <Chip 
      variant={ isHover ? "filled" : "outlined" }
      color={props.color as ("default" | "primary" | "secondary" | "warning" | "info" | "error" | "success")} 
      size="small"
      label={<Stack direction={"row"} alignItems={"center"}>{isHover ? <CancelIcon onClick={() => props.removeTag(props.id)} sx={{fontSize: "1.1em", mr: 0.5, cursor: "pointer"}} /> : <CircleIcon sx={{fontSize: "1.1em", mr: 0.5}} />} {props.label}</Stack>}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlur={handleMouseLeave} /> 
  );
}
