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
    GET_AVAILABILITY_BY_DATE_AND_USER,
    UPDATE_AVAILABILITY_SLOT
} from '../../../queries/availabilityQueries';
import RequestWrapper2 from "../../../common/RequestWrapper2";
import {AvailabilitySlot} from "../../../../../server/src/schemas/availabilitySchema";
import TimePickerStrip from "./TimePickerStrip";
import TimeSlot from "../../../types/TimeSlot";

function parseDate(dateString: string): string | null {
    if(dateString != "" && dateString != null){
        return new Date(dateString).getTime() + ""
    } else {
        return null
    }
}

export default function ManageMyAvailabilityPage() {
    const {search} = useLocation();
    const [dateString, setDateString] = useState("");
    const [availabilityQuery, availabilityQueryResult ] = useLazyQuery(GET_AVAILABILITY_BY_DATE_AND_USER, {
        onCompleted: (data) => {
            setAvailabilitySlots(data.availabilityByDateAndUser)
            setTempAvailability(data.availabilityByDateAndUser)
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

            let changed = tempAvailability.filter((slot1: AvailabilitySlot) => {
                return availabilitySlots.some((slot2: AvailabilitySlot) => {
                    return slot2.id == slot1.id && (slot2.startTime != slot1.startTime || slot2.endTime != slot1.endTime)
                })
            })

            let deleted = availabilitySlots.filter((slot1: AvailabilitySlot) => {
                return !tempAvailability.some((slot2: AvailabilitySlot) => {
                    return slot2.id == slot1.id
                })
            })

            let created = tempAvailability.filter((slot1: AvailabilitySlot) => {
                return !availabilitySlots.some((slot2: AvailabilitySlot) => {
                    return slot2.id == slot1.id
                })
            })

            // mutations for new slots
            for (const newSlot of created) {

                await createAvailabilitySlotMutation({
                    variables: {
                        date: newSlot.date,
                        startTime: newSlot.startTime,
                        endTime: newSlot.endTime,
                        userID: currentUser.id,
                    },
                });
                console.log('added')
            }

            // mutations for updated slots
            for (const updatedSlot of changed) {
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
            for (const deletedSlot of deleted) {
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
                                <AvailabilityStrip availability={tempAvailability.map((slot) => {
                                    return {
                                        startTime: slot.startTime,
                                        endTime: slot.endTime
                                    }
                                }) as TimeSlot[]}/>
                            </Paper>

                            <TimePickerStrip availability={tempAvailability} setAvailabilitySlots={setTempAvailability} date={dateString} uid={currentUser.id} onSave={onSave} />

                        </Stack>
                    );
                }}
            />
        </Page>
    )
}