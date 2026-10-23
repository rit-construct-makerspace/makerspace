import { useMutation, useQuery } from "@apollo/client/react";
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import rawWithDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { Calendar, dateFnsLocalizer, Event, SlotInfo, Views } from "react-big-calendar";
import { addWeeks, format, getDay, parse, startOfWeek, subDays } from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { fallbackTheme } from "../../types/site_settings/ThemeController";
import { useCurrentUser } from "../../common/CurrentUserProvider";
import { isManagerFor } from "../../common/PrivilegeUtils";
import RequestWrapper2 from "../../common/RequestWrapper2";
import {
  CREATE_STAFF_SHIFTS,
  DELETE_STAFF_SHIFT,
  GET_MAKERSPACE_STAFF,
  GET_STAFF_SHIFTS,
  UPDATE_STAFF_SHIFT
} from "../../queries/staffScheduleQueries";
import { StaffMember, StaffShift, StaffShiftEvent } from "../../types/StaffShift";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const withDragAndDrop = (() => {
  let fn: any = rawWithDragAndDrop;
  while (fn && typeof fn !== "function") {
    fn = fn.default;
  }
  return fn;
})();

const DnDCalendar = withDragAndDrop(Calendar);
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS }
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

function weekRange(date: Date) {
  const start = startOfWeek(date);
  return {
    start,
    end: addWeeks(start, 1)
  };
}

export default function StaffSchedulePage() {
  const { makerspaceID } = useParams<{ makerspaceID: string }>();
  const makerspaceIDNumber = Number(makerspaceID);
  const user = useCurrentUser();
  const manager = isManagerFor(user, makerspaceIDNumber);
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState(() => weekRange(new Date()));
  const [draft, setDraft] = useState<{ start: Date; end: Date }>();
  const [selectedStaffID, setSelectedStaffID] = useState("");
  const [repeatWeeks, setRepeatWeeks] = useState(1);
  const [selectedShift, setSelectedShift] = useState<StaffShift>();

  const staffResult = useQuery<{ makerspaceStaff: StaffMember[] }>(GET_MAKERSPACE_STAFF, {
    variables: { makerspaceID: makerspaceIDNumber }
  });
  const shiftsResult = useQuery<{ staffShifts: StaffShift[] }>(GET_STAFF_SHIFTS, {
    variables: {
      makerspaceID: makerspaceIDNumber,
      start: addWeeks(range.start, -1).toISOString(),
      end: range.end.toISOString()
    }
  });

  const [createShifts] = useMutation(CREATE_STAFF_SHIFTS);
  const [updateShift] = useMutation(UPDATE_STAFF_SHIFT);
  const [deleteShift] = useMutation(DELETE_STAFF_SHIFT);

  function navigateTo(newDate: Date) {
    setDate(newDate);
    setRange(weekRange(newDate));
    setDraft(undefined);
    setSelectedShift(undefined);
  }

  function handleRangeChange(newRange: Date[] | { start: Date; end: Date }) {
    const start = Array.isArray(newRange) ? newRange[0] : newRange.start;
    if (start) {
      setRange(weekRange(start));
    }
  }

  function handleSlotSelect(selection: SlotInfo) {
    if (!manager || selection.end <= selection.start) return;
    setDraft({ start: selection.start, end: selection.end });
    setSelectedShift(undefined);
  }

  async function saveShiftTimes(shifts: { id: number; start: Date; end: Date }[]) {
    try {
      for (const shift of shifts) {
        await updateShift({
          variables: {
            id: shift.id,
            start: shift.start.toISOString(),
            end: shift.end.toISOString()
          }
        });
      }
      await shiftsResult.refetch();
    } catch (error) {
      toast.error(`Failed to update shift: ${error}`);
      await shiftsResult.refetch();
    }
  }

  function handleEventDrop(drop: { event: Event; start: Date; end: Date }) {
    const event = drop.event as StaffShiftEvent;
    void saveShiftTimes([{ id: event.shift.id, start: drop.start, end: drop.end }]);
  }

  function handleEventResize(resize: { event: Event; start: Date; end: Date }) {
    const event = resize.event as StaffShiftEvent;
    void saveShiftTimes([{ id: event.shift.id, start: resize.start, end: resize.end }]);
  }

  async function handleCreateShifts() {
    if (!draft || !selectedStaffID) return;
    const weeks = Math.max(1, Math.min(52, Math.floor(Number(repeatWeeks) || 1)));
    const shifts = Array.from({ length: weeks }, (_, index) => ({
      userID: Number(selectedStaffID),
      start: addWeeks(draft.start, index).toISOString(),
      end: addWeeks(draft.end, index).toISOString()
    }));

    try {
      await createShifts({ variables: { makerspaceID: makerspaceIDNumber, shifts } });
      toast.success(weeks === 1 ? "Shift scheduled" : `Shift scheduled for ${weeks} weeks`);
      setDraft(undefined);
      setSelectedStaffID("");
      setRepeatWeeks(1);
      await shiftsResult.refetch();
    } catch (error) {
      toast.error(`Failed to schedule shift: ${error}`);
    }
  }

  async function handleCopyPreviousWeek() {
    const start = addWeeks(range.start, -1);
    const end = addWeeks(range.end, -1);
    const previousWeek = (shiftsResult.data?.staffShifts ?? []).filter((shift: StaffShift) => {
      const shiftStart = new Date(shift.start);
      return shiftStart >= start && shiftStart < end;
    });
    if (previousWeek.length === 0) {
      toast.info("There are no shifts to copy from the previous week");
      return;
    }

    const shifts = previousWeek.map((shift: StaffShift) => ({
      userID: shift.userID,
      start: addWeeks(new Date(shift.start), 1).toISOString(),
      end: addWeeks(new Date(shift.end), 1).toISOString()
    }));
    try {
      await createShifts({ variables: { makerspaceID: makerspaceIDNumber, shifts } });
      toast.success("Copied shifts from the previous week");
      await shiftsResult.refetch();
    } catch (error) {
      toast.error(`Failed to copy previous week: ${error}`);
    }
  }

  async function handleDeleteShift() {
    if (!selectedShift) return;
    try {
      await deleteShift({ variables: { id: selectedShift.id } });
      toast.success("Shift deleted");
      setSelectedShift(undefined);
      await shiftsResult.refetch();
    } catch (error) {
      toast.error(`Failed to delete shift: ${error}`);
    }
  }

  return (
    <RequestWrapper2 result={staffResult} render={(staffData) => (
      <RequestWrapper2 result={shiftsResult} render={(shiftData) => {
        const staff: StaffMember[] = staffData.makerspaceStaff;
        const shifts: StaffShift[] = shiftData.staffShifts;
        const visibleStart = range.start;
        const visibleEnd = range.end;
        const events: StaffShiftEvent[] = shifts
          .filter((shift) => {
            const shiftStart = new Date(shift.start);
            const shiftEnd = new Date(shift.end);
            return shiftStart < visibleEnd && shiftEnd > visibleStart;
          })
          .map((shift) => ({
            title: `${shift.user.firstName} ${shift.user.lastName}`,
            start: new Date(shift.start),
            end: new Date(shift.end),
            isDraggable: manager,
            shift
          }));

        return (
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} padding={2} width="100%">
            <title>Staff Schedule</title>
            <Stack spacing={2} width={{ xs: "100%", md: 300 }} flexShrink={0}>
              <Typography variant="h5">Staff Schedule</Typography>
              <Typography color="text.secondary">
                {format(range.start, "MMM d")} – {format(subDays(range.end, 1), "MMM d, yyyy")}
              </Typography>
              {manager ? (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<FileCopyOutlinedIcon />}
                    onClick={() => void handleCopyPreviousWeek()}
                  >
                    Copy previous week
                  </Button>
                  {draft ? (
                    <Stack spacing={2}>
                      <Typography variant="subtitle1">New shift</Typography>
                      <Paper sx={{ p: 1.5 }}>
                        <Typography variant="body2">From: {dateFormatter.format(draft.start)}</Typography>
                        <Typography variant="body2">To: {dateFormatter.format(draft.end)}</Typography>
                      </Paper>
                      <FormControl fullWidth>
                        <InputLabel id="staff-select-label">Staff member</InputLabel>
                        <Select
                          labelId="staff-select-label"
                          label="Staff member"
                          value={selectedStaffID}
                          onChange={(event) => setSelectedStaffID(event.target.value)}
                        >
                          {staff.map((member) => (
                            <MenuItem key={member.id} value={member.id}>
                              {member.firstName} {member.lastName} ({member.ritUsername})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Repeat weekly (total weeks)"
                        type="number"
                        inputProps={{ min: 1, max: 52 }}
                        value={repeatWeeks}
                        onChange={(event) => setRepeatWeeks(Number(event.target.value))}
                      />
                      <Stack direction="row" spacing={1}>
                        <Button color="inherit" onClick={() => setDraft(undefined)}>Cancel</Button>
                        <Button
                          variant="contained"
                          disabled={!selectedStaffID || staff.length === 0}
                          onClick={() => void handleCreateShifts()}
                        >
                          Schedule
                        </Button>
                      </Stack>
                    </Stack>
                  ) : null}
                </>
              ) : (
                null
              )}
              {selectedShift ? (
                <Stack spacing={1}>
                  <Typography variant="subtitle1">
                    {selectedShift.user.firstName} {selectedShift.user.lastName}
                  </Typography>
                  <Typography variant="body2">{dateFormatter.format(new Date(selectedShift.start))}</Typography>
                  <Typography variant="body2">{dateFormatter.format(new Date(selectedShift.end))}</Typography>
                  {manager ? (
                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => void handleDeleteShift()}
                    >
                      Delete shift
                    </Button>
                  ) : null}
                </Stack>
              ) : !manager ? (
                <Typography color="text.secondary">Select a shift to view its details.</Typography>
              ) : null}
            </Stack>
            <ThemeProvider theme={fallbackTheme.getTheme()}>
              <Paper sx={{ width: "100%", minWidth: 0, p: 1 }}>
                <DnDCalendar
                  date={date}
                  onNavigate={navigateTo}
                  localizer={localizer}
                  view={Views.WEEK}
                  views={[Views.WEEK]}
                  selectable={manager}
                  resizable={manager}
                  step={15}
                  timeslots={2}
                  style={{ height: 750 }}
                  events={events}
                  onSelectSlot={handleSlotSelect}
                  onSelectEvent={(event: StaffShiftEvent) => {
                    setDraft(undefined);
                    setSelectedShift(event.shift);
                  }}
                  onEventDrop={handleEventDrop}
                  onEventResize={handleEventResize}
                  onRangeChange={handleRangeChange}
                  draggableAccessor="isDraggable"
                  eventPropGetter={() => ({
                    style: {
                      backgroundColor: fallbackTheme.getTheme().palette.primary.main,
                      border: 0
                    }
                  })}
                />
              </Paper>
            </ThemeProvider>
          </Stack>
        );
      }} />
    )} />
  );
}
