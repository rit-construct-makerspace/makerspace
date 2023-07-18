import {Paper, Stack, TextField} from "@mui/material";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Page from "../../Page";
import {useLazyQuery, useMutation} from "@apollo/client";
import AvailabilityStrip from "../../maker/create_reservation/AvailabilityStrip";
import TimeLabelStrip from "../../maker/create_reservation/TimeLabelStrip";
import { useCurrentUser } from "../../../common/CurrentUserProvider"
import {CREATE_AVAILABILITY_SLOT, GET_ALL_AVAILABILITY} from '../../../queries/availabilityQueries';
import RequestWrapper2 from "../../../common/RequestWrapper2";
import {AvailabilityRow} from "../../../../../server/src/db/tables";


function parseDate(dateString: string): Date | null {
    if(dateString != "" && dateString != null){
        return new Date(new Date(dateString).getTime() + 86400000)
    } else {
        return null
    }
}

// function tester(rawData: AvailabilityRow[]): TimeSlot[] {
//     return rawData.map((x) => {x.startTime.toTimeString(), x.endTime.toTimeString()})
// }

export default function ManageMyAvailabilityPage() {
    const {search} = useLocation();
    const [dateString, setDateString] = useState("");
    const [availabilityQuery, availabilityQueryResult ] = useLazyQuery(GET_ALL_AVAILABILITY)
    const [testMut, mutResult] = useMutation(CREATE_AVAILABILITY_SLOT)
    const navigate = useNavigate();
    const currentUser = useCurrentUser();

    useEffect(() => {
        const date = new URLSearchParams(search).get("date") ?? ""

        setDateString(date)

        if(dateString != ""){
            availabilityQuery({
                variables: {
                    date: parseDate(dateString),
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

    const testInsert = () => {
        console.log(new Date('2012-12-12T14:30:00.000Z'))
        testMut({
            variables: {
                date: new Date('2023-07-02T00:00:00.000Z'),
                startTime: new Date('2012-12-12T14:30:00.000Z'),
                endTime: new Date('2012-12-12T15:30:00.000Z'),
                userID: 1
            }
        })
    }

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
                    <AvailabilityStrip availability={[
                        {
                            "startTime": "12:45",
                            "endTime": "15:00"
                        },
                        {
                            "startTime": "16:45",
                            "endTime": "19:30"
                        }
                    ]}/>
                </Paper>
            </Stack>

            <TextField
                label="time"
                type="time"
                size="small"
                onChange={testInsert}
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
                                <AvailabilityStrip availability={data.availabilitySlots.map((x:AvailabilityRow) => {x.startTime, x.endTime})}/>
                            </Paper>
                        </Stack>
                    );
                }}
            />
        </Page>
    )
}