import {TextField} from "@mui/material";
import React, {ChangeEvent, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Page from "../../Page";

export default function ManageMyAvailabilityPage(){
    //const date = searchParams.get("date") ?? "";
    const { search } = useLocation();
    const [dateString, setDateString] = useState("");

    const navigate = useNavigate();
    const handleDateChange =
        (paramName: string, setter: (s: string) => void) =>
            (e: ChangeEvent<HTMLInputElement>) => {
                setter(e.target.value);
                setUrlParam(paramName, e.target.value);
            };

    const setUrlParam = (paramName: string, paramValue: string) => {
        const params = new URLSearchParams(search);
        params.set(paramName, paramValue);
        navigate("/admin/reservations/availability?" + params, { replace: true });
    };

    return (
        <Page title={"Availability"}>
            <TextField
            label="Start"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ width: 180 }}
            value={dateString}
            onChange={handleDateChange("date", setDateString)}
            />
        </Page>
    )
}