import PrettyModal from "../../../common/PrettyModal";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EQUIPMENT_BY_ID } from "../../../queries/equipmentQueries";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { Avatar, Box, Button, Card, Chip, Divider, Icon, IconButton, MenuItem, Select, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import TrainingModuleRow from "../../../common/TrainingModuleRow";
import {
  ModuleStatus,
  moduleStatusMapper,
} from "../../../common/TrainingModuleUtils";
import CloseButton from "../../../common/CloseButton";
import ReservationAttachment from "../../lab_management/reservations/ReservationAttachment";
import Markdown from "react-markdown";
import { CREATE_MAINTENANCE_TAG, GET_MAINTENANCE_TAGS, MaintenanceTag } from "../../../queries/maintenanceLogQueries";
import MaintenanceTagRow from "./MaintenanceTagRow";
import { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';


const CHIP_COLORS: ("default" | "primary" | "secondary" | "warning" | "info" | "error" | "success")[] = ["primary", "secondary", "warning", "info", "error", "success"];

export default function MaintenanceTagsModal({ maintenanceTags, tagModalOpen, setTagModalOpen, equipmentID }: { maintenanceTags: MaintenanceTag[], tagModalOpen: boolean, setTagModalOpen: React.Dispatch<React.SetStateAction<boolean>>, equipmentID: number }) {
  const navigate = useNavigate();

  const [createTag] = useMutation(CREATE_MAINTENANCE_TAG, { refetchQueries: [{ query: GET_MAINTENANCE_TAGS }] });

  const [newLabel, setNewLabel] = useState<string>("");
  const [newColor, setNewColor] = useState<"default" | "primary" | "secondary" | "warning" | "info" | "error" | "success">("primary");

  function handleCreateSubmit() {
    createTag({variables: {
      label: newLabel,
      color: newColor,
    }});
  }

  return (
    <PrettyModal
      open={tagModalOpen}
      onClose={() => setTagModalOpen(false)}
      width={600}
    >
      <Typography variant="h5">Tags</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Color</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {maintenanceTags.map((tag: MaintenanceTag) => (
            <MaintenanceTagRow id={tag.id} label={tag.label} color={tag.color} />
          ))}
          {maintenanceTags.length == 0 && <Typography variant="h6">No tags.</Typography>}
        </TableBody>
        <TableFooter>
          Create New Tag
          <TableRow>
            <TableCell>
              <Stack direction={"row"}>
                <IconButton color="success" onClick={handleCreateSubmit}><CheckIcon /></IconButton>
              </Stack>
            </TableCell>
            <TableCell><TextField value={newLabel} onChange={(e) => setNewLabel(e.target.value)} /></TableCell>
            <TableCell>
              <Select value={newColor} onChange={(e) => setNewColor(e.target.value as ("default" | "primary" | "secondary" | "warning" | "info" | "error" | "success"))}>
                {CHIP_COLORS.map((selColor: any) => (<MenuItem value={selColor}><Chip variant="outlined" color={selColor} label={selColor} /></MenuItem>))}
              </Select>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </PrettyModal>
  );
}
