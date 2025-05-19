import { useLazyQuery, useQuery } from "@apollo/client";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import gql from "graphql-tag";
import { ReactElement, useEffect, useState } from "react";
import PageSectionHeader from "../../../common/PageSectionHeader";
import GET_EQUIPMENTS from "../../../queries/equipmentQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import Equipment from "../../../types/Equipment";
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import RequestWrapper2 from "../../../common/RequestWrapper2";
import AuditLogEntity from "../audit_logs/AuditLogEntity";
import { format } from "date-fns";

const GET_VERBOSE_EQUIPMENT_SESSIONS = gql`
  query GetEquipmentSessionsWithAttachedEntities($startDate: String, $endDate: String, $equipmentIDs: [Int]) {
    getEquipmentSessionsWithAttachedEntities(startDate: $startDate, endDate: $endDate, equipmentIDs: $equipmentIDs) {
      id
      start
      equipmentID
      userID
      userName
      sessionLength
      readerSlug
      equipmentName
      roomID
      roomName
      zoneID
      zoneName
    }
  }
`;


/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 * 
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the amount of time
 */
function secondsToHumanString (seconds: number) {
    var levels = [
        [Math.floor(seconds / 31536000), 'years'],
        [Math.floor((seconds % 31536000) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
        [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
    ];
    var returntext = '';

    for (var i = 0, max = levels.length; i < max; i++) {
        if ( levels[i][0] === 0 ) continue;
        returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
    };
    return returntext.trim();
}


export function EquipmentStats() {
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

  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [equipmentIDs, setEquipmentIDs] = useState<string[]>([]);

  const [showClearButton, setShowClearButton] = useState<boolean>(false);

  const [getEquipmentSessions, getEquipmentSessionsResult] = useLazyQuery(GET_VERBOSE_EQUIPMENT_SESSIONS);

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setStartDate(e.target.value)
    if (startDate && startDate != "") setShowClearButton(true);
  }

  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setEndDate(e.target.value)
    if (endDate && endDate != "") setShowClearButton(true);
  }

  function handleEquipmentIDsChange(e: SelectChangeEvent<string[]>) {
    setEquipmentIDs(e.target.value as string[])
    if (equipmentIDs && equipmentIDs.length > 0) setShowClearButton(true);
  }

  function handleClear() {
    setStartDate("");
    setEndDate("");
    setEquipmentIDs([]);
    setShowClearButton(false);
  }

  function handleSubmit() {
    var variables = {
      ...(startDate && startDate != "" && { startDate }),
      ...(endDate && endDate != "" && { endDate }),
      ...(equipmentIDs && equipmentIDs.length > 0 && { equipmentIDs })
    };
    getEquipmentSessions({ variables });
  }




  //Dropdown query
  const getEquipment = useQuery(GET_EQUIPMENTS);

  return (
    <Box>
      <PageSectionHeader>Equipment Sessions</PageSectionHeader>

      <Stack direction={isMobile ? "column" : "row"} spacing={2}>
        <TextField
          label="Start"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ width: 180 }}
          value={startDate}
          onChange={handleStartDateChange}
        />
        <TextField
          label="Stop"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ width: 180 }}
          value={endDate}
          onChange={handleEndDateChange}
        />

        <RequestWrapper loading={getEquipment.loading} error={getEquipment.error}>
          <FormControl>
            <InputLabel id="es-stat_equipment-select_label">Equipment</InputLabel>
            <Select
              labelId="es-stat_equipment-select_label"
              value={equipmentIDs}
              label="Equipment"
              multiple
              onChange={handleEquipmentIDsChange}
            >
              {getEquipment.data.equipments.map((equipment: Equipment) => (
                <MenuItem value={equipment.id}>{equipment.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </RequestWrapper>

        {showClearButton && (
          <IconButton onClick={handleClear} sx={{ ml: "8px !important" }}>
            <CloseIcon />
          </IconButton>
        )}
        <Button onClick={handleSubmit} variant="contained" color="primary">Search</Button>
      </Stack>

      <Box sx={{ height: 400, width: '100%' }}>
        <RequestWrapper2 result={getEquipmentSessionsResult} render={function (data: any): ReactElement {
          const rows = data.getEquipmentSessionsWithAttachedEntities;

          const columns: GridColDef<(typeof rows)[number]>[] = [
            {
              field: 'id',
              headerName: 'ID',
              width: 90
            },
            {
              field: 'readerSlug',
              headerName: 'ACS',
              width: 120
            },
            {
              field: 'equipment',
              headerName: 'Equipment',
              width: 270,
              valueGetter: (value, row) => (<AuditLogEntity entityCode={`equipment:${row.equipmentID}:${row.equipmentName}`} />)
            },
            {
              field: 'user',
              headerName: 'User',
              width: 270,
              valueGetter: (value, row) => (<AuditLogEntity entityCode={`user:${row.userID}:${row.userName}`} />)
            },
            {
              field: 'room',
              headerName: 'Room',
              width: 270,
              valueGetter: (value, row) => (<AuditLogEntity entityCode={`room:${row.roomID}:${row.roomName}`} />)
            },
            {
              field: 'zone',
              headerName: 'Zone',
              width: 270,
              valueGetter: (value, row) => `${row.zoneName} (${row.zoneID})`
            },
            {
              field: 'start',
              headerName: 'Start',
              width: 120,
              valueGetter: (value) => format(new Date(value), "M/d/yy h:mmaaa")
            },
            {
              field: 'sessionLength',
              headerName: 'Session Length',
              width: 120,
              valueGetter: (value) => secondsToHumanString(value)
            },
          ];

          return (
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              //checkboxSelection
              disableRowSelectionOnClick
            />
          )
        }}>
        </RequestWrapper2>
      </Box>
    </Box>
  )
}