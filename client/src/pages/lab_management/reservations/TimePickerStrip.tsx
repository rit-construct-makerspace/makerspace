import TimeSlot from "../../../types/TimeSlot";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import React, {ReactNode, useState} from "react";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {TextField, Stack, CircularProgress, Fab, Button, IconButton} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

interface TimeSlotTimePickerDivProps {
    slot: TimeSlot;
    index: number;
    editSlots: (slot: TimeSlot, index: number) => void;
}

function TimeSlotTimePickerDiv({slot, index, editSlots}: TimeSlotTimePickerDivProps): ReactNode {
    const [start, setStart] = useState(new Date(slot.startTime))
    const [end, setEnd] = useState(new Date(slot.endTime))

    const handleStartChange = async (time: Date | null) => {

        if(time!=null) {
            setStart(time)
            editSlots({startTime: time.toString(), endTime: end.toString()}, index)
        }
    }
    const handleEndChange = async (time: Date | null) => {
        if(time!=null) {
            setEnd(time)
            editSlots({startTime: start.toString(), endTime: time.toString()}, index)}
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

        <IconButton aria-label="delete">
            <DeleteIcon />
        </IconButton>

    </div>
}

interface TimePickerStripProps {
    availability: TimeSlot[];
    setTimeSlots: (t: TimeSlot[]) => void;
}

export default function TimePickerStrip({availability, setTimeSlots}: TimePickerStripProps) {

    const onSave = async () => {
    }

    const onNewClick = async () => {
        //arr.push(TimeSlotTimePickerDiv({slot: {startTime: new Date('2012-12-12 23:59').toString(), endTime: new Date('2012-12-12 23:59').toString()}, index: arr.length}))
    }

    const editSlots = async (slot: TimeSlot, index: number) => {
        var copy = JSON.parse(JSON.stringify(availability))
        console.log(copy)
        copy[index] = slot
        setTimeSlots(copy)
    }

    const arr: ReactNode[] = [];

    availability.forEach((timeSlot, index) => {
        arr.push(TimeSlotTimePickerDiv({slot: timeSlot, index: index, editSlots: editSlots}))
    });

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