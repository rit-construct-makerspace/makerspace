import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
    FormControl,
    InputLabel
  } from "@mui/material";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DateTimePicker } from '@mui/lab';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useQuery } from '@apollo/client';
import { GET_RESERVABLE_EQUIPMENT_FOR_MODULE } from "../../../queries/getEquipments";
import RequestWrapper from '../../../common/RequestWrapper';
import Equipment from '../../../types/Equipment';
import { useState } from 'react';

interface ReservationPromptProps {
    moduleID: number;
    promptText: string | undefined;
    reservation: { dateTime: Date | null, equipmentID: number | undefined };
    updateReservation: (reservation: { dateTime: Date | null, equipmentID: number | undefined }) => void;
}

export default function ReservationPromptCard({
  moduleID,
  promptText,
  reservation,
  updateReservation
}: ReservationPromptProps) {
  const [equipment, setEquipment] = useState<string | number>('');
  const result = useQuery(
    GET_RESERVABLE_EQUIPMENT_FOR_MODULE,
    { 
      variables: { moduleID: moduleID }
    });

  return (
    <RequestWrapper
        loading={result.loading}
        error={result.error}>
      <Card sx={{ width: 0.85 }}>
        <CardContent>
          <Grid container rowSpacing={3} columnSpacing={3} alignContent={"center"} sx={{width: 1}} justifySelf={"center"}>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 500, mb: 1 }}> Make a reservation </Typography>
                <Box component="div" sx={{ overflowX: "auto" }}>
                  <Typography component="div">
                    <pre style={{ fontFamily: 'inherit' }}>
                      {promptText ?? "Make a reservation"}
                    </pre>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                          label="Date+Time Picker"
                          value={new Date(new Date().getFullYear(), 0, 1, 12)}
                          onChange={(newValue)=>{
                            updateReservation({ ...reservation, dateTime: newValue });
                          }}
                          renderInput={(params) =>
                              <TextField
                                  sx={{width:1}}
                                  {...params}
                              />
                          }
                      />
                  </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="equipment-select-label">Equipment</InputLabel>
                  <Select
                    label="Equipment"
                    value={equipment}
                    onChange={(e)=>{ setEquipment(e.target.value) }}
                    sx={{width:1}}
                    >
                      {
                        result.data?.module?.equipment ?
                            result.data?.module?.equipment?.map((equipment: Equipment) => {
                              return <MenuItem key={equipment.id} value={equipment.id}>{equipment.name}</MenuItem>
                            })
                          : null
                      }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    startIcon={<EventAvailableIcon />}
                    variant="contained"
                    sx={{justifySelf: "flex-end"}}
                  >
                    Create reservation
                  </Button>
                </Box>
              </Grid>
          </Grid>
        </CardContent>
      </Card>
    </RequestWrapper>
  );
}
