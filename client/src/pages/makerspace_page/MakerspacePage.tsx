import { useQuery } from "@apollo/client";
import { Box, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { FullZone, GET_ZONE_BY_ID } from "../../queries/getZones";
import RequestWrapper2 from "../../common/RequestWrapper2";
import { ReactElement } from "react";
import { ZoneDash } from "../both/homepage/ZoneDash";

export default function MakerspacePage() {
    const { id } = useParams<{ id: string }>();

    const getZone = useQuery(GET_ZONE_BY_ID, {variables: {id: id}});

    return (
        <RequestWrapper2 result={getZone} render={(data) => {
            return (
                <Box padding="20px">
                    <ZoneDash zone={data.zoneByID} open={true}/>
                </Box>
            );
        }} />
    );
}