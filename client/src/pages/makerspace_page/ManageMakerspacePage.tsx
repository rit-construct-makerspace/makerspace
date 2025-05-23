import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { FullZone, GET_ZONE_BY_ID, DELETE_ZONE } from "../../queries/zoneQueries";
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import RequestWrapper2 from "../../common/RequestWrapper2";
import { useEffect, useState } from "react";
import SaveIcon from '@mui/icons-material/Save';
import ZoneCard from "../lab_management/monitor/ZoneCard";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPage from "../AdminPage";
import ZoneHourOptions from "../lab_management/monitor/ZoneHourOptions";


export default function ManageMakerspacePage() {
    const { makerspaceID } = useParams<{ makerspaceID: string }>();

    const getZone = useQuery(GET_ZONE_BY_ID, {variables: {id: makerspaceID}});
    const [deleteZone] = useMutation(DELETE_ZONE);
    
    const [name, setName] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    const [init, setInit] = useState(false);

    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    
    function handleWindowSizeChange() {
        setWindowWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = windowWidth <= 1100;

    function initState(zone: FullZone) {
        setName(zone.name);
        setImgUrl(zone.imageUrl);
        setInit(true);
    }

    return (
        <AdminPage>
        <RequestWrapper2 result={getZone} render={(data) => {

                const zone: FullZone = data.zoneByID;

                if (!init) {
                    initState(zone);
                }

                const handleDeleteZone = () => {
                    const confirm = window.confirm("Are you sure you want to delete? This cannot be undone.");
                    if (confirm)
                    deleteZone({
                        variables: { id: zone.id },
                        refetchQueries: [{ query:  GET_ZONE_BY_ID, variables: {id: makerspaceID}}],
                    });
                };

            return (
                <Stack spacing={3} padding="20px">
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        justifyContent={isMobile ? undefined : "space-between"}
                        alignItems="center"
                        spacing={isMobile ? 2 : undefined}
                    >
                        <Typography variant="h4" align="center">{`Edit ${zone.name} Makerspace [ID: ${zone.id}]`}</Typography>
                        <Button color="error" variant="contained" onClick={handleDeleteZone} startIcon={<DeleteIcon/>}>Delete Makerspace</Button>
                    </Stack>
                    <Stack direction={isMobile ? "column" : "row"} justifyContent="center" spacing={2} width="auto">
                        <Stack spacing={2} width={isMobile ? "auto" :"800px"}>
                            <TextField label="Name" value={name} onChange={(e) => (setName(e.target.value))}/>
                            <TextField label="Image URL" value={imgUrl} onChange={(e) => (setImgUrl(e.target.value))}/>
                            <Button color="primary" variant="contained" startIcon={<SaveIcon/>}>Update</Button>
                        </Stack>
                        <Box width={isMobile ? "350px" : "800px"}>
                            <ZoneHourOptions zoneID={zone.id} />
                        </Box>
                    </Stack>
                </Stack>
            );
        }}/>
        </AdminPage>
    );
}