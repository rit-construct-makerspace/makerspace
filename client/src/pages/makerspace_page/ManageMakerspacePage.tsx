import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { FullZone, GET_ZONE_BY_ID } from "../../queries/zoneQueries";
import { Button, Stack, TextField, Typography } from "@mui/material";
import RequestWrapper2 from "../../common/RequestWrapper2";
import { useState } from "react";
import SaveIcon from '@mui/icons-material/Save';


export default function ManageMakerspacePage() {
    const { makerspaceID } = useParams<{ makerspaceID: string }>();

    const getZone = useQuery(GET_ZONE_BY_ID, {variables: {id: makerspaceID}});
    
    const [name, setName] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    const [init, setInit] = useState(false);


    function initState(zone: FullZone) {
        setName(zone.name);
        setImgUrl(zone.imageUrl);
        setInit(true);
    }

    return (
        <RequestWrapper2 result={getZone} render={(data) => {

                const zone: FullZone = data.zoneByID;

                if (!init) {
                    initState(zone);
                }

            return (
                <Stack spacing={3} padding="20px">
                    <Typography variant="h4">Edit {zone.name} Makerspace</Typography>
                    <Stack spacing={2}>
                        <TextField label="Name" value={name} onChange={(e) => (setName(e.target.value))}/>
                        <TextField label="Image URL" value={imgUrl} onChange={(e) => (setImgUrl(e.target.value))}/>
                        <Button color="primary" variant="contained" startIcon={<SaveIcon/>}>Update</Button>
                    </Stack>
                </Stack>
            );
        }}/>
    );
}