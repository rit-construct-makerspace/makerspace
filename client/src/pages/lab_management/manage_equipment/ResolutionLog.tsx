import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, InputLabel, MenuItem, Select, Stack, styled, Tab, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Tabs, TextareaAutosize, TextField, Typography } from "@mui/material";
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
import { EquipmentInstance, GET_EQUIPMENT_INSTANCES } from "../../../queries/equipmentInstanceQueries";




export default function ResolutionLogPage() {
  const equipmentID = useParams<{ logid: string }>().logid;

  const [newContent, setNewContent] = useState<string>("");
  const [newInstance, setNewInstance] = useState<number>();

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

  const resolutionLogsQueryResult = useQuery(GET_RESOLUTION_LOGS, { variables: { equipmentID } });
  const maintenanceTagsResult = useQuery(GET_MAINTENANCE_TAGS, {variables: {equipmentID}});
  const instancesQueryResult = useQuery(GET_EQUIPMENT_INSTANCES, { variables: { equipmentID } });

  const [createResolutionLog] = useMutation(CREATE_RESOLUTION_LOG, { refetchQueries: [{ query: GET_RESOLUTION_LOGS, variables: { equipmentID } }] });

  const [tagModalOpen, setTagModalOpen] = useState(false);

  const [timestampSort, setTimestampSort] = useState<'asc' | 'desc'>('desc');
  const [authorSort, setAuthorSort] = useState<'asc' | 'desc'>('desc');

  return (
    <AdminPage title="Resolution Log" topRightAddons={[<Button startIcon={<KeyboardReturnIcon />} color="secondary" onClick={() => navigate(`/admin/equipment/issues/${equipmentID}`)}>Back to Issues</Button>, <Button startIcon={<LabelIcon />} onClick={() => setTagModalOpen(true)}>Manage Tags</Button>]}>
      <RequestWrapper loading={resolutionLogsQueryResult.loading} error={resolutionLogsQueryResult.error}>
        <Box width={"100%"}>
          <Box width={"100%"}>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key={0}
                    >

                    </TableCell>
                    <TableCell>
                      Instance
                    </TableCell>
                    <TableCell
                      align={'left'}
                      sortDirection={timestampSort}
                      width={"70px"}
                    >
                      <TableSortLabel
                        direction={timestampSort}
                        onClick={() => setTimestampSort(timestampSort == 'asc' ? 'desc' : 'asc')}
                      >
                        Timestamp
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align={'left'}
                    >
                      Tags
                    </TableCell>
                    <TableCell
                      align={'left'}
                      sortDirection={authorSort}
                    >
                      <TableSortLabel
                        direction={authorSort}
                        onClick={() => setAuthorSort(authorSort == 'asc' ? 'desc' : 'asc')}
                      >
                        Author
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align={'left'}
                    >
                      Content
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resolutionLogsQueryResult.data && resolutionLogsQueryResult.data.getResolutionLogsByEquipment.map((item: MaintenanceLogItem) => (
                    <MaintenanceLogEntry logItem={item} isResolution={true} allTags={maintenanceTagsResult.data?.getMaintenanceTags ?? []} />
                  ))}
                  {!resolutionLogsQueryResult.data || resolutionLogsQueryResult.data.getResolutionLogsByEquipment.length == 0 && <Typography variant="h6" color={"secondary"} p={3}>No logs.</Typography>}
                </TableBody>
              </Table>
            </Box>

            <Stack direction={"column"} px={2} spacing={2} mt={5}>
              <>
                <InputLabel>Content</InputLabel>
                <TextField
                  value={newContent}
                  placeholder="Content *"
                  onChange={(e: any) => setNewContent(e.target.value)}
                ></TextField>
              </>
              <>
                <InputLabel>Instance</InputLabel>
                <RequestWrapper loading={instancesQueryResult.loading} error={instancesQueryResult.error}>
                  <Select value={newInstance} placeholder="Instance" onChange={(e) => setNewInstance(Number(e.target.value))}>
                    {instancesQueryResult.data?.equipmentInstances.map((instance: EquipmentInstance) => (
                      <MenuItem value={instance.id}>{instance.name}</MenuItem>
                    ))}
                  </Select>
                </RequestWrapper>
              </>
              <Button
                variant="contained"
                onClick={() => createResolutionLog({ variables: { equipmentID, content: newContent, instanceID: newInstance } })}
              >
                Post
              </Button>
            </Stack>
          </Box>
        </Box>
      </RequestWrapper>

      <MaintenanceTagsModal tagModalOpen={tagModalOpen} setTagModalOpen={setTagModalOpen} equipmentID={Number(equipmentID)} />
    </AdminPage>
  );
}

