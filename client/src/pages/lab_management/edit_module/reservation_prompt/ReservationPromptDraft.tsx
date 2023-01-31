import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Card,
  IconButton,
  CardContent,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { ReservationPrompt } from "../../../../types/Quiz";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DateTimePicker } from '@mui/lab';

interface ReservationPromptDraftProps {
  item: ReservationPrompt | undefined;
  updatePrompt: (updatedReservationPrompt: ReservationPrompt) => void;
}

export default function ReservationPromptDraft({
  item,
  updatePrompt,
}: ReservationPromptDraftProps) {
  return (
    <Card
          elevation={4}
          sx={{ width: 600, display: "flex", mb: 4, flexFlow: "column nowrap" }}
        >
      <CardContent>
        <Grid container rowSpacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              component="div"
            >
              Reservation Prompt
            </Typography>
          </Grid>
          <Grid item xs={12}>
              <TextField
                  label="Prompt"
                  multiline
                  maxRows={20}
                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                          updatePrompt({
                            promptText: e.target.value,
                            enabled: item!.enabled
                          });
                      }
                  }
                  value={item!.promptText}
              />
          </Grid>
          <Grid item sx={{alignSelf: "center"}} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                          disabled={true}
                          label="Date+Time Picker"
                          value={new Date(new Date().getFullYear(), 0, 1, 12)}
                          onChange={()=>{}}
                          renderInput={(params) =>
                              <TextField
                                  {...params}
                                  sx={{width:0.5, ml: 1}}
                              />
                          }
                      />
              </LocalizationProvider>
          </Grid>
          <Grid item sx={{alignSelf: "center"}} xs={12}>
              <Select
                  disabled={true}
                  value={"Equipment"}
                  label="Equipment"
                  onChange={()=>{}}
                  sx={{width:0.5, ml: 1}}
                  >
                      <MenuItem value={"Equipment"}>Equipment</MenuItem>
                  </Select>
              </Grid>
          </Grid>
      </CardContent>
    </Card>
  );
}
