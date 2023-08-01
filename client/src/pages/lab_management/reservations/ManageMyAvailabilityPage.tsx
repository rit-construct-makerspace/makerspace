import {Paper, Stack, TextField} from "@mui/material";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Page from "../../Page";
import {useLazyQuery, useMutation} from "@apollo/client";
import AvailabilityStrip from "../../maker/create_reservation/AvailabilityStrip";
import TimeLabelStrip from "../../maker/create_reservation/TimeLabelStrip";
import { useCurrentUser } from "../../../common/CurrentUserProvider"
import {
    CREATE_AVAILABILITY_SLOT,
    DELETE_AVAILABILITY_SLOT,
    GET_ALL_AVAILABILITY,
    UPDATE_AVAILABILITY_SLOT
} from '../../../queries/availabilityQueries';
import RequestWrapper2 from "../../../common/RequestWrapper2";
import {AvailabilitySlot} from "../../../../../server/src/schemas/availabilitySchema";
import TimePickerStrip from "./TimePickerStrip";

function parseDate(dateString: string): Date | null {
    if(dateString != "" && dateString != null){
        return new Date(new Date(dateString).getTime() + 86400000)
    } else {
        return null
    }
}


export default function ManageMyAvailabilityPage() {
    const {search} = useLocation();
    const [dateString, setDateString] = useState("");
    const [availabilityQuery, availabilityQueryResult ] = useLazyQuery(GET_ALL_AVAILABILITY, {
        onCompleted: (data) => {
            setAvailabilitySlots(data.availabilitySlots)
            setTempAvailability(data.availabilitySlots)
            console.log(data)
        }
    })
    const [createAvailabilitySlotMutation] = useMutation(CREATE_AVAILABILITY_SLOT);
    const [updateAvailabilitySlotMutation] = useMutation(UPDATE_AVAILABILITY_SLOT);
    const [deleteAvailabilitySlotMutation] = useMutation(DELETE_AVAILABILITY_SLOT);
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([])
    const [tempAvailability, setTempAvailability] = useState<AvailabilitySlot[]>([])

    useEffect(() => {
        const date = new URLSearchParams(search).get("date") ?? ""

        setDateString(date)

        if(date != ""){
            availabilityQuery({
                variables: {
                    date: parseDate(date),
                    userID: currentUser.id,
                }
            })
        }


    }, [search, availabilityQuery])


    const handleDateChange =
        (paramName: string, setter: (s: string) => void) =>
            (e: ChangeEvent<HTMLInputElement>) => {
                setter(e.target.value);
                setUrlParam(paramName, e.target.value);
            };

    const setUrlParam = (paramName: string, paramValue: string) => {
        const params = new URLSearchParams(search);
        params.set(paramName, paramValue);
        navigate("/admin/reservations/availability?" + params, {replace: true});
    };

    const onSave = async () => {
        try {
            const updatedIds = new Set(tempAvailability.map((slot) => slot.id));
            const newSlots = tempAvailability.filter((slot) => !slot.id);
            const updatedSlotMap = tempAvailability.reduce((map, slot) => {
                if (slot.id) map.set(slot.id, slot);
                return map;
            }, new Map());
            const deletedSlots = availabilitySlots.filter((slot) => !updatedIds.has(slot.id));
            const updatedSlotsArr = availabilitySlots
                .filter((slot) => updatedSlotMap.has(slot.id))
                .map((slot) => {
                    const updatedSlot = updatedSlotMap.get(slot.id);
                    if (
                        updatedSlot.startTime !== slot.startTime ||
                        updatedSlot.endTime !== slot.endTime
                    ) {
                        return updatedSlot;
                    }
                    return slot;
                });

            console.log(newSlots)
            console.log(updatedSlotsArr)
            console.log(deletedSlots)

            // mutations for new slots
            for (const newSlot of newSlots) {
                console.log('mut1')
                await createAvailabilitySlotMutation({
                    variables: {
                        date: newSlot.startTime,
                        startTime: newSlot.startTime,
                        endTime: newSlot.endTime,
                        userID: currentUser.id,
                    },
                });
            }

            // mutations for updated slots
            for (const updatedSlot of updatedSlotsArr) {
                console.log('mut2')
                await updateAvailabilitySlotMutation({
                    variables: {
                        id: updatedSlot.id,
                        date: updatedSlot.date,
                        startTime: updatedSlot.startTime,
                        endTime: updatedSlot.endTime,
                        userID: updatedSlot.userID,
                    },
                });
            }

            // mutations for deleted slots
            for (const deletedSlot of deletedSlots) {
                console.log('mut3')
                await deleteAvailabilitySlotMutation({
                    variables: { id: deletedSlot.id },
                });
            }

            // update availabilitySlots state with the tempAvailability state
            setAvailabilitySlots(tempAvailability);
        } catch (error) {
            console.error("Error saving availability slots:", error);
        }
    };
    return (
        <Page title={"My Availability"}>
            Select a day to change your available hours:
            <br/>
            <br/>
            <TextField
                label="Date"
                type="date"
                size="small"
                InputLabelProps={{shrink: true}}
                sx={{width: 180}}
                value={dateString}
                onChange={handleDateChange("date", setDateString)}
            />


            <RequestWrapper2
                result={availabilityQueryResult}
                render={(data) => {
                    return (
                        <Stack direction="row" mt={4}>
                            <TimeLabelStrip marginTop={-10} />
                            <Paper
                                elevation={2}
                                sx={{
                                    height: "fit-content",
                                    overflow: "hidden",
                                    mr: 4,
                                }}
                            >
                                <AvailabilityStrip availability={tempAvailability}/>
                            </Paper>

                            <TimePickerStrip availability={tempAvailability} setAvailabilitySlots={setTempAvailability} date={dateString} uid={currentUser.id} onSave={onSave} />

                        </Stack>
                    );
                }}
            />
        </Page>
    )
}