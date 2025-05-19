import { useMutation, useQuery } from "@apollo/client";
import { Autocomplete, AutocompleteRenderInputParams, Box, Button, Divider, IconButton, Modal, Stack, Switch, TextField, Typography } from "@mui/material";
import { GET_EQUIPMENT_BY_ID, UPDATE_EQUIPMENT } from "../../queries/equipmentQueries";
import RequestWrapper2 from "../../common/RequestWrapper2";
import Equipment, { EquipmentWithRoom } from "../../types/Equipment";
import CloseIcon from '@mui/icons-material/Close';
import { SyntheticEvent, useState } from "react";
import styled from "styled-components";
import GET_ROOMS from "../../queries/getRooms";
import AttachedModule from "../lab_management/manage_equipment/AttachedModule";
import { ObjectSummary } from "../../types/Common";
import GET_TRAINING_MODULES from "../../queries/trainingQueries";
import { equal } from "assert";

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
    const getModulesResult = useQuery(GET_TRAINING_MODULES);
    const [updateEquipment] = useMutation(UPDATE_EQUIPMENT);

    const [name, setName] = useState("");
    const [roomID, setRoomID] = useState(0);
    const [imageURL, setImageURL] = useState("");
    const [sopURL, setSopURL] = useState("");
    const [description, setDescription] = useState("");
    const [reservationOnly, setReservationOnly] = useState(false);
    const [trainingModules, setTrainingModules] = useState<number[]>([]);


    return (
        <RequestWrapper2 result={getEquipmentResult} render={(data) => {

            const equipment: EquipmentWithRoom = data.equipment;

            setName(equipment.name);
            setImageURL(equipment.imageUrl ?? "");
            setSopURL(equipment.sopUrl);
            setDescription(equipment.notes);
            setReservationOnly(equipment.byReservationOnly);
            
            equipment.trainingModules.map((tm: any) => {
                if (!trainingModules.includes(tm.id)) {
                    setTrainingModules([tm.id, ...trainingModules]);
                }
            });

            function handleModuleRemoved(id: any) {
                setTrainingModules(trainingModules.filter((tmp) => tmp !== id))
            }

            const handleModuleAdded = (e: SyntheticEvent, value: ObjectSummary | null) => {
                if (!value) return;
                setTrainingModules([value.id, ...trainingModules]);
            };
    
            const getModuleOptions = (): ObjectSummary[] => {
                if (!getModulesResult.data) return [];
            
                return getModulesResult.data.modules.filter(
                    (m: ObjectSummary) => !trainingModules.includes(m.id)
                );
            };

            const getAttatchedModules = (): ObjectSummary[] => {
                if (!getModulesResult.data) return [];
            
                return getModulesResult.data.modules.filter(
                    (m: ObjectSummary) => trainingModules.includes(m.id)
                );
            };

            const handleSave = async () => {
                await updateEquipment({variables: {
                    id: equipment.id,
                    name: name,
                    roomID: roomID,
                    moduleIDs: trainingModules,
                    imageUrl: imageURL,
                    sopUrl: sopURL,
                    notes: description,
                    byReservationOnly: reservationOnly,
                }});
            };

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
                            <Stack width="auto" padding="10px" spacing={2} alignItems="stretch">
                                <TextField
                                    required
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
                                            onChange={(e: any, newValue: any) => (setRoomID(newValue.id))}
                                        />
                                    );
                                }}
                                />
                                <TextField
                                    label="Description"
                                    defaultValue={equipment.notes}
                                    multiline
                                    rows={3}
                                    onChange={(e) => {setDescription(e.target.value)}}
                                />
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="body1">By Reservation Only</Typography>
                                    <Switch defaultChecked={equipment.byReservationOnly} onChange={(e) => {setReservationOnly(e.target.checked)}} />
                                </Stack>
                            </Stack>
                            <Typography variant="h5">Training Modules</Typography>
                            <Stack width="auto" padding="10px" spacing={2} alignItems="stretch">
                                <Stack divider={<Divider flexItem />} spacing={1}>
                                    {getAttatchedModules().map((mod: any) => (
                                        <AttachedModule
                                            module={mod}
                                            key={mod.id}
                                            onRemove={() => (handleModuleRemoved(mod.id))}
                                        />
                                    ))}
                                </Stack>
                                <Autocomplete
                                    key={equipment.trainingModules.length}
                                    renderOption={(params, module: any) => (
                                    <li {...params} key={module.id}>
                                        {module.name}
                                    </li>
                                    )}
                                    renderInput={(params: any) => (
                                    <TextField {...params} label="Attach module" key={module.id} />
                                    )}
                                    options={getModuleOptions()}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => option.name}
                                    onChange={handleModuleAdded}
                                />
                            </Stack>
                            <Stack direction="row" justifyContent="flex-end" padding="10px">
                                    <Button color="success" variant="contained" onClick={handleSave}>Save</Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Modal>
            );

        }}
            
        />
    );
}