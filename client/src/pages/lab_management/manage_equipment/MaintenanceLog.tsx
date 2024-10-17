import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, Stack, styled, Table, TableCell, TableHead, TableRow, TextareaAutosize, TextField, Typography } from "@mui/material";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { gql, useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import { DELETE_INVENTORY_LEDGER, GET_LEDGERS } from "../../../queries/inventoryQueries";
import AuditLogEntity from "../audit_logs/AuditLogEntity";
import { InventoryLedger } from "../../../types/InventoryItem";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { CREATE_MAINTENANCE_LOG, DELETE_MAINTENANCE_LOG, GET_MAINTENANCE_LOGS, MaintenanceLogItem } from "../../../queries/maintenanceLogQueries";
import MaintenanceLogEntry from "./MaintenanceLogEntry";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import PrettyModal from "../../../common/PrettyModal";




export default function MaintenanceLogModal({equipmentID} : {equipmentID: string}) {
  const [newContent, setNewContent] = useState<string>("");

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

  const queryResult = useQuery(GET_MAINTENANCE_LOGS, {variables: {equipmentID}});

  const [createLog] = useMutation(CREATE_MAINTENANCE_LOG, { refetchQueries: [{ query: GET_MAINTENANCE_LOGS, variables: {equipmentID} }] });

  return (
    <PrettyModal
      open={!!equipmentID}
      onClose={() => navigate("/admin/equipment")}
      width={800}
    >
      <RequestWrapper loading={queryResult.loading} error={queryResult.error}>
        <Box height={"100%"}>
          <Typography  variant="h5" component="div" mb={3}>Maintenance Log</Typography>

          <Box>
            <Stack direction={"column"} divider={<Divider />}>
              {queryResult.data && queryResult.data.getMaintenanceLogsByEquipment.map((item: MaintenanceLogItem) => (
                <MaintenanceLogEntry logItem={item} />
              ))}
            </Stack>
            {!queryResult.data || queryResult.data.getMaintenanceLogsByEquipment.length == 0 && <Typography variant="h6" color={"secondary"} p={3}>No logs.</Typography>}
          </Box>

          <Stack direction={isMobile ? "column" : "row"} px={2} spacing={2} mt={5}>
            <TextField
              value={newContent}
              onChange={(e: any) => setNewContent(e.target.value)}
            ></TextField>
            <Button
              variant="contained"
              onClick={() => createLog({ variables: { equipmentID, content: newContent } })}
            >
              Post
            </Button>
          </Stack>
        </Box>
      </RequestWrapper>
    </PrettyModal>
  );
}

