import {
    Button,
    Card,
    Typography
} from "@mui/material";
import {useCurrentUser} from "../../../common/CurrentUserProvider";
import React from "react";

export default function AccountBalanceCard() {
    return (
        <Card sx={{ width: 350, height: 150, padding: 2, border: 1, borderColor: "lightgrey" } } >
            <Typography variant="h4" color={"black"}>Balance</Typography>
            <Typography variant="h3" color={"darkorange"} align={"center"} marginTop={3}>{useCurrentUser().balance}</Typography>
        </Card>
    );
}
