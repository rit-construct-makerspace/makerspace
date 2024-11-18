import PrettyModal from "../../../common/PrettyModal";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EQUIPMENT_BY_ID } from "../../../queries/equipmentQueries";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { Avatar, Box, Button, Card, Chip, Divider, FormControlLabel, Icon, IconButton, InputLabel, MenuItem, Select, Stack, Switch, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
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
import { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import RequestWrapper from "../../../common/RequestWrapper";
import { CREATE_INVENTORY_TAG, GET_INVENTORY_TAGS } from "../../../queries/inventoryQueries";
import InventoryTagRow from "./InventoryTagRow";
import { InventoryTag } from "../../../types/InventoryItem";


const CHIP_COLORS: ("default" | "primary" | "secondary" | "warning" | "info" | "error" | "success")[] = ["primary", "secondary", "warning", "info", "error", "success"];

export default function InventoryTagsModal({ tagModalOpen, setTagModalOpen }: { tagModalOpen: boolean, setTagModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const navigate = useNavigate();

  const inventoryTagsResult = useQuery(GET_INVENTORY_TAGS);

  const inventoryTags = inventoryTagsResult.data?.inventoryTags ?? [];

  const [createTag] = useMutation(CREATE_INVENTORY_TAG, { refetchQueries: [{ query: GET_INVENTORY_TAGS }], awaitRefetchQueries: true });

  const [newLabel, setNewLabel] = useState<string>("");
  const [newColor, setNewColor] = useState<"default" | "primary" | "secondary" | "warning" | "info" | "error" | "success">("primary");

  function handleCreateSubmit() {
    createTag({
      variables: {
        label: newLabel,
        color: newColor,
      }
    });

    setNewLabel("");
    setNewColor("primary");
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
            <TableCell>Equipment</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Color</TableCell>
          </TableRow>
        </TableHead>
        <RequestWrapper loading={inventoryTagsResult.loading} error={inventoryTagsResult.error}>
          <TableBody>
            {inventoryTags.map((tag: InventoryTag) => (
              <InventoryTagRow id={tag.id} label={tag.label} color={tag.color} />
            ))}
            {inventoryTags.length == 0 && <Typography variant="h6">No tags.</Typography>}
          </TableBody>
        </RequestWrapper>
      </Table>
      <Stack direction={"column"} mt={3} width={"50%"}>
        <Typography>Create New Tag</Typography>
        <>
          <InputLabel>Label</InputLabel>
          <TextField value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
        </>
        <>
          <InputLabel>Color</InputLabel>
          <Select value={newColor} onChange={(e) => setNewColor(e.target.value as ("default" | "primary" | "secondary" | "warning" | "info" | "error" | "success"))}>
            {CHIP_COLORS.map((selColor: any) => (<MenuItem value={selColor}><Chip variant="outlined" color={selColor} label={selColor} /></MenuItem>))}
          </Select>
        </>
        <Button variant="outlined" onClick={handleCreateSubmit}>Add Tag</Button>
      </Stack>
    </PrettyModal>
  );
}
