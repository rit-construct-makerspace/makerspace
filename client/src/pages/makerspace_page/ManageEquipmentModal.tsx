import { useQuery } from "@apollo/client";
import { Autocomplete, AutocompleteRenderInputParams, Box, IconButton, Modal, Stack, TextField, Typography } from "@mui/material";
import { GET_EQUIPMENT_BY_ID } from "../../queries/equipmentQueries";
import RequestWrapper2 from "../../common/RequestWrapper2";
import Equipment, { EquipmentWithRoom } from "../../types/Equipment";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import styled from "styled-components";
import GET_ROOMS from "../../queries/getRooms";

interface ManageEquipmentModalProps {
    equipmentID: number;
    open: boolean;
    onClose: () => void;
}

export default function ManageEquipmentModal(props: ManageEquipmentModalProps) {

    const StyledMachineImage = styled.img`
      width: 128px;
      height: 128px;
      border-radius: 4px;
    `;

    const getEquipmentResult = useQuery(GET_EQUIPMENT_BY_ID, { variables: { id: props.equipmentID } });
    const getRoomsResult = useQuery(GET_ROOMS);

    const [name, setName] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [sopURL, setSopURL] = useState("");

    return (
        <RequestWrapper2 result={getEquipmentResult} render={(data) => {

            const equipment: EquipmentWithRoom = data.equipment;

            return (
                <Modal
                open={props.open}
                onClose={props.onClose}
                >
                    <Box width="100%" height="100%" justifyContent="center" alignItems="center" display="flex">
                        <Stack width="800px" padding="20px" sx={{backgroundColor: "white", borderRadius: "10px"}} spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                                <Typography variant="h5">{equipment.name}</Typography>
                                <IconButton onClick={() => {props.onClose()}} sx={{color: "gray"}}>
                                    <CloseIcon />
                                </IconButton>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Box width="128px" height="128px" sx={{backgroundColor: "gray", borderRadius: "4px"}}>
                                    <StyledMachineImage
                                        alt="Machine image"
                                        src={(equipment.imageUrl == undefined || equipment.imageUrl == null ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : "" + process.env.REACT_APP_CDN_URL + process.env.REACT_APP_CDN_EQUIPMENT_DIR + "/" + equipment.imageUrl)}
                                    />
                                </Box>
                                <Stack width="100%" padding="10px" spacing={2}>
                                    <TextField
                                        label="Name"
                                        defaultValue={equipment.name}
                                        onChange={(e) => {setName(e.target.value)}}
                                    />
                                    <TextField
                                        label="Image URL"
                                        defaultValue={equipment.imageUrl}
                                        onChange={(e) => {setImageURL(e.target.value)}}
                                    />
                                    <TextField
                                        label="SOP URL"
                                        defaultValue={equipment.sopUrl}
                                        onChange={(e) => {setSopURL(e.target.value)}}
                                    />
                                    <RequestWrapper2 result={getRoomsResult} render={(data) => {
                                        return (
                                            <Autocomplete
                                                renderInput={(params: any) => (
                                                    <TextField {...params} label="Location" />
                                                )}
                                                options={data.rooms ?? []}
                                                defaultValue={equipment.room}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                getOptionLabel={(option) => option.name}
                                                disableClearable
                                            />
                                        );
                                    }}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                </Modal>
            );

        }}
            
        />
    );
}