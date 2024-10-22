import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, Stack, styled, Tab, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Tabs, TextareaAutosize, TextField, Typography } from "@mui/material";
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
import MaintenanceTagsModal from "./MaintenanceTagsModal";




export default function MaintenanceLogPage() {
  const equipmentID = useParams<{ logid: string }>().logid;

  const [tab, setTab] = useState<number>(0);

  const [newContent, setNewContent] = useState<string>("");
  const [newResolutionContent, setNewResolutionContent] = useState<string>("");

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

  const maintenanceLogsQueryResult = useQuery(GET_MAINTENANCE_LOGS, { variables: { equipmentID } });
  const resolutionLogsQueryResult = useQuery(GET_RESOLUTION_LOGS, { variables: { equipmentID } });
  const maintenanceTagsResult = useQuery(GET_MAINTENANCE_TAGS);

  const [createLog] = useMutation(CREATE_MAINTENANCE_LOG, { refetchQueries: [{ query: GET_MAINTENANCE_LOGS, variables: { equipmentID } }] });
  const [createResolutionLog] = useMutation(CREATE_RESOLUTION_LOG, { refetchQueries: [{ query: GET_RESOLUTION_LOGS, variables: { equipmentID } }] });

  const [tagModalOpen, setTagModalOpen] = useState(false);

  const [timestampSort, setTimestampSort] = useState<'asc' | 'desc'>('desc');
  const [authorSort, setAuthorSort] = useState<'asc' | 'desc'>('desc');

  return (
    <AdminPage title="Maintenance Log" topRightAddons={<Button startIcon={<LabelIcon />} onClick={() => setTagModalOpen(true)}>Manage Tags</Button>}>
      <RequestWrapper loading={maintenanceLogsQueryResult.loading} error={maintenanceLogsQueryResult.error}>
        <Box width={"100%"}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} aria-label="Log Tabs">
              <Tab label="Issue Log" value={0} />
              <Tab label="Resolution Log" value={1} />
            </Tabs>
          </Box>
          {tab == 0 && <Box width={"100%"}>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key={0}
                    >

                    </TableCell>
                    <TableCell
                      key={1}
                      sortDirection={timestampSort}
                    >
                      <TableSortLabel
                        direction={timestampSort}
                        onClick={() => setTimestampSort(timestampSort == 'asc' ? 'desc' : 'asc')}
                      >
                        Timestamp
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key={2}
                    >
                      Tags
                    </TableCell>
                    <TableCell
                      key={3}
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
                      key={4}
                    >
                      Content
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceLogsQueryResult.data && maintenanceLogsQueryResult.data.getMaintenanceLogsByEquipment.map((item: MaintenanceLogItem) => (
                    <MaintenanceLogEntry logItem={item} isResolution={false} allTags={maintenanceTagsResult.data?.getMaintenanceTags ?? []} />
                  ))}
                  {!maintenanceLogsQueryResult.data || maintenanceLogsQueryResult.data.getMaintenanceLogsByEquipment.length == 0 && <Typography variant="h6" color={"secondary"} p={3}>No logs.</Typography>}
                </TableBody>
              </Table>
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
          </Box>}
          {tab == 1 && <Box width={"100%"}>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key={0}
                    >

                    </TableCell>
                    <TableCell
                      align={'left'}
                      sortDirection={timestampSort}
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

            <Stack direction={isMobile ? "column" : "row"} px={2} spacing={2} mt={5}>
              <TextField
                value={newResolutionContent}
                onChange={(e: any) => setNewResolutionContent(e.target.value)}
              ></TextField>
              <Button
                variant="contained"
                onClick={() => createResolutionLog({ variables: { equipmentID, content: newResolutionContent } })}
              >
                Post
              </Button>
            </Stack>
          </Box>}
        </Box>
      </RequestWrapper>

      <MaintenanceTagsModal maintenanceTags={maintenanceTagsResult.data?.getMaintenanceTags ?? []} tagModalOpen={tagModalOpen} setTagModalOpen={setTagModalOpen} equipmentID={Number(equipmentID)} />
    </AdminPage>
  );
}

