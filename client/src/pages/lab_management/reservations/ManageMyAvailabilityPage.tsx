import {Divider, Paper, Stack, TextField, TextFieldProps, Typography} from "@mui/material";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Page from "../../Page";
import AuditLogRow from "../audit_logs/AuditLogRow";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import {useLazyQuery} from "@apollo/client";
import {MobileTimePicker, TimePicker} from '@mui/x-date-pickers';
import AvailabilityStrip from "../../maker/create_reservation/AvailabilityStrip";
import TimeLabelStrip from "../../maker/create_reservation/TimeLabelStrip";

export default function ManageMyAvailabilityPage() {
    //const date = searchParams.get("date") ?? "";
    const {search} = useLocation();
    const [dateString, setDateString] = useState("");
    //const [availabilityQuery, availabilityQueryResult ] = useLazyQuery(GET_AVAILABILITY)
    const navigate = useNavigate();

    useEffect(() => {
        const date = new URLSearchParams(search).get("date") ?? ""

        setDateString(date)

        //availabilityQuery({variables: {date: ""}})  FIGURE OUT DATE FORMAT


    }, [search
        //, availabilityQuery
    ])

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


            {/* <RequestWrapper2
                result={availabilityQueryResult}
                render={(data) => {
                    // if (data.auditLogs.length === 0) {
                    //     return (
                    //         <Typography
                    //             variant="body1"
                    //             sx={{
                    //                 fontStyle: "italic",
                    //                 color: "grey.700",
                    //                 mx: "auto",
                    //                 my: 8,
                    //             }}
                    //         >
                    //             No results.
                    //         </Typography>
                    //     );
                    // }
                    // return (
                    //     <Stack divider={<Divider flexItem />} mt={4} spacing={2}>
                    //         {data.auditLogs.map((log: any) => (
                    //             <AuditLogRow
                    //                 key={log.id}
                    //                 dateTime={log.dateTime}
                    //                 message={log.message}
                    //             />
                    //         ))}
                    //     </Stack>
                    // );
                }}
            /> */}
        </Page>
    )
}