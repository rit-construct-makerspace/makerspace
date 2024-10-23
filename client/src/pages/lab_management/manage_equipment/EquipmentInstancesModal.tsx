import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Card, Divider, IconButton, MenuItem, Select, Stack, styled, Tab, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Tabs, TextareaAutosize, TextField, Typography } from "@mui/material";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { gql, useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import { DELETE_INVENTORY_LEDGER, GET_LEDGERS } from "../../../queries/inventoryQueries";
import AuditLogEntity from "../audit_logs/AuditLogEntity";
import { InventoryLedger } from "../../../types/InventoryItem";
import { format } from "date-fns";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CREATE_MAINTENANCE_LOG, CREATE_RESOLUTION_LOG, DELETE_MAINTENANCE_LOG, GET_MAINTENANCE_LOGS, GET_MAINTENANCE_TAGS, GET_RESOLUTION_LOGS, MaintenanceLogItem } from "../../../queries/maintenanceLogQueries";
import MaintenanceLogEntry from "./MaintenanceLogEntry";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import AdminPage from "../../AdminPage";
import LabelIcon from '@mui/icons-material/Label';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import MaintenanceTagsModal from "./MaintenanceTagsModal";
import PrettyModal from "../../../common/PrettyModal";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { CREATE_EQUIPMENT_INSTANCE, DELETE_EQUIPMENT_INSTANCE, EquipmentInstance, GET_EQUIPMENT_INSTANCES, InstanceStatus, SET_INSTANCE_NAME, SET_INSTANCE_STATUS } from "../../../queries/equipmentInstanceQueries";
import ActionButton from "../../../common/ActionButton";
import EquipmentInstanceRow from "./EquipmentInstanceRow";




export default function EquipmentInstancesModal({equipmentID, equipmentName, isOpen, setIsOpen} : {equipmentID: number, equipmentName: string, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const currentUser = useCurrentUser();

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
  const isMobile = width <= 1100;

  const navigate = useNavigate();

  const equipmentInstancesResult = useQuery(GET_EQUIPMENT_INSTANCES, {variables: {equipmentID}});

  const [createInstance] = useMutation(CREATE_EQUIPMENT_INSTANCE, { refetchQueries: [{ query: GET_EQUIPMENT_INSTANCES, variables: {equipmentID} }] });

  const [name, setName] = useState<string>();

  function handleCreateInstanceClick() {
    createInstance({variables: {equipmentID, name}})
  }

  return (
    <PrettyModal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      width={520}
    >
      <RequestWrapper loading={equipmentInstancesResult.loading} error={equipmentInstancesResult.error}>
        <Box>
          <Typography variant="h5">{equipmentName} Instances</Typography>
          <Stack direction={"column"}>
            {equipmentInstancesResult.data?.equipmentInstances.map((instance: EquipmentInstance) => (
              <EquipmentInstanceRow instance={instance} />
            ))}
            {equipmentInstancesResult.data?.equipmentInstances.length == 0 && <Typography m={3} color={"secondary"}>No Instances.</Typography>}
          </Stack>
          <Stack direction={"row"} mt={3}>
            <TextField placeholder="New Instance" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={handleCreateInstanceClick}>Create Instance</Button>
          </Stack>
        </Box>
      </RequestWrapper>
    </PrettyModal>
  );
}

