import TimeSlot from "../../../types/TimeSlot";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import React, {useState} from "react";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {TextField, Stack, CircularProgress, Fab, Button, IconButton} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import {AvailabilitySlot} from "../../../../../server/src/schemas/availabilitySchema";

interface TimeSlotTimePickerDivProps {
    slot: TimeSlot;
    index: number;
    editSlot: (slot: TimeSlot, index: number) => void;
    deleteSlot: (index: number) => void
}

function TimeSlotTimePickerDiv({slot, index, editSlot, deleteSlot}: TimeSlotTimePickerDivProps): JSX.Element {
    const [start, setStart] = useState(new Date(slot.startTime))
    const [end, setEnd] = useState(new Date(slot.endTime))

    const handleStartChange = (time: Date | null) => {

        if(time!=null) {
            setStart(time)
            editSlot({startTime: time.getTime() + "", endTime: end.getTime() + ""}, index)
        }
    }
    const handleEndChange = (time: Date | null) => {
        if(time!=null) {
            setEnd(time)
            editSlot({startTime: start.getTime() + "", endTime: time.getTime() + ""}, index)}
    }

    return <div
        key={`time-picker-slot-${index}`}>
        <div>{index+1}</div>
        <TimePicker
            label="Start"
            onChange={(time)=>{handleStartChange(time)}}
            value={start}
            minTime={new Date('2012-12-12 09:00')}
            maxTime={new Date('2012-12-12 21:00')}
            renderInput={props =>
                <TextField
                    InputLabelProps={{shrink: true}}
                    size="small"
                    sx={{width:'9vw', marginBottom: '1vw', fontSize:'.5vw'}}
                    {...props}
                />
            }
            minutesStep={15}
        />

        <TimePicker
            label="End"
            onChange={(time)=>{handleEndChange(time)}}
            value={end}
            minTime={new Date('2012-12-12 09:00')}
            maxTime={new Date('2012-12-12 21:00')}
            renderInput={props =>
                <TextField
                    InputLabelProps={{shrink: true}}
                    size="small"
                    sx={{width:'9vw', marginBottom: '1vw', fontSize:'1vw'}}
                    {...props}
                />
            }
            minutesStep={15}
        />

        <IconButton
            aria-label="delete"
            onClick={() =>{deleteSlot(index)}}>
            <DeleteIcon />
        </IconButton>

    </div>
}

interface TimePickerStripProps {
    availability: AvailabilitySlot[];
    setAvailabilitySlots: (t: AvailabilitySlot[]) => void;
    date: string;
    uid: string;
    onSave: () => void;
}

export default function TimePickerStrip({availability, setAvailabilitySlots, date, uid, onSave}: TimePickerStripProps) {

    const onNewClick = async () => {
        var copy = JSON.parse(JSON.stringify(availability))
        copy.push({
            id: null,
            date: new Date(date).getTime() + "",
            startTime: new Date('2012-12-12 24:00:00').getTime() + "",
            endTime: new Date('2012-12-12 24:00:00').getTime() + "",
            userID: uid
        })
        setAvailabilitySlots(copy)
    }

    const editSlots = async (slot: TimeSlot, index: number) => {
        let copy = JSON.parse(JSON.stringify(availability))
        copy[index].startTime = slot.startTime
        copy[index].endTime = slot.endTime
        setAvailabilitySlots(copy)
    }

    const deleteSlot = async (index: number) => {
        var copy = JSON.parse(JSON.stringify(availability))
        copy.splice(index, 1)
        setAvailabilitySlots(copy)
    }

    const arr = availability.map((availabilitySlot, index) => (
        <TimeSlotTimePickerDiv
            key={`time-picker-slot-${index}`}
            slot={{
                startTime: new Date(parseInt(availabilitySlot.startTime)).toString(),
                endTime: new Date(parseInt(availabilitySlot.endTime)).toString(),
            }}
            index={index}
            editSlot={editSlots}
            deleteSlot={deleteSlot}
        />
    ));

    return <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack direction='column'>
            {arr}

            <Button
                variant="contained"
                size="large"
                sx={{ mt: 4, alignSelf: "flex-start" }}
                onClick={onNewClick}
            >
                New +
            </Button>

            <Fab
                color="primary"
                onClick={onSave}
                sx={{
                    position: "absolute",
                    bottom: 40,
                    mr: -12,
                    alignSelf: "flex-end",
                }}
            >
                <SaveIcon />
            </Fab>
        </Stack>

    </LocalizationProvider>
}