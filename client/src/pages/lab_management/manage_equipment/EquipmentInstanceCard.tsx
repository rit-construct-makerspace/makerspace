import { Button, Card, IconButton, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { DELETE_EQUIPMENT_INSTANCE, EquipmentInstance, GET_EQUIPMENT_INSTANCES, InstanceStatus, SET_INSTANCE_NAME, SET_INSTANCE_STATUS } from "../../../queries/equipmentInstanceQueries";
import { useState } from "react";
import ActionButton from "../../../common/ActionButton";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from "@apollo/client";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

interface EquipmentInstanceCardProps {
    instance: EquipmentInstance;
}

export default function EquipmentInstanceCard(props: EquipmentInstanceCardProps) {

    const [setInstanceName] = useMutation(SET_INSTANCE_NAME, { refetchQueries: [{ query: GET_EQUIPMENT_INSTANCES, variables: {equipmentID: props.instance.equipment.id} }] });
    const [setInstanceStatus] = useMutation(SET_INSTANCE_STATUS, { refetchQueries: [{ query: GET_EQUIPMENT_INSTANCES, variables: {equipmentID: props.instance.equipment.id} }] });
    const [deleteInstance] = useMutation(DELETE_EQUIPMENT_INSTANCE, { refetchQueries: [{ query: GET_EQUIPMENT_INSTANCES, variables: {equipmentID: props.instance.equipment.id} }] });

    const [name, setName] = useState<string>(props.instance.name);
    const [allowEdit, setAllowEdit] = useState(false);
    const [status, setStatus] = useState<InstanceStatus>(props.instance.status);
    const [state, setState] = useState("IDLE");

    async function handlenameChangeSubmit() {
        setAllowEdit(false);
        setInstanceName({ variables: { id: props.instance.id, name } })
    }

    async function handlenameChangeCancel() {
    setAllowEdit(false);
    setName(props.instance.name)
    }

    function handleStatusChange(e: any) {
        setStatus(e.target.value);
        setInstanceStatus({ variables: { id: props.instance.id, status: e.target.value } })
    }

    function handleStateChange(e: any) {
        setState(e.target.value);
    }

    return (
        <Card sx={{padding: "15px"}}>
            <Stack spacing={1}>
                <Stack direction="row" alignItems="center" justifyContent={"space-between"} width="200px">
                    {
                        !allowEdit
                        ? <Typography variant="h6" fontWeight={"bold"}>{props.instance.name}</Typography>
                        : <TextField size="small" value={name} onChange={(e) => setName(e.target.value)}></TextField>
                    }
                    {
                        !allowEdit
                        ? <>
                        <ActionButton iconSize={20} color={"primary"} appearance={"icon-only"} tooltipText="Rename" handleClick={async () => setAllowEdit(true)}
                            loading={false}><DriveFileRenameOutlineIcon /></ActionButton>
                        </>
                        : <>
                        <ActionButton iconSize={20} color={"success"} appearance={"icon-only"} tooltipText="Submit" handleClick={handlenameChangeSubmit}
                            loading={false}><CheckIcon /></ActionButton>
                        <ActionButton iconSize={20} color={"error"} appearance={"icon-only"} tooltipText="Cancel" handleClick={handlenameChangeCancel}
                            loading={false}><CloseIcon /></ActionButton>
                        </>
                    }
                </Stack>
                <Select size="small" defaultValue={props.instance.status} value={status} onChange={handleStatusChange}>
                    <MenuItem value={InstanceStatus.ACTIVE}>{InstanceStatus.ACTIVE}</MenuItem>
                    <MenuItem value={InstanceStatus.NEEDS_REPAIRS}>{InstanceStatus.NEEDS_REPAIRS}</MenuItem>
                    <MenuItem value={InstanceStatus.UNDER_REPAIRS}>{InstanceStatus.UNDER_REPAIRS}</MenuItem>
                    <MenuItem value={InstanceStatus.TESTING}>{InstanceStatus.TESTING}</MenuItem>
                    <MenuItem value={InstanceStatus.UNDEPLOYED}>{InstanceStatus.UNDEPLOYED}</MenuItem>
                    <MenuItem value={InstanceStatus.RETIRED}>{InstanceStatus.RETIRED}</MenuItem>
                </Select>
                <Stack direction="row" justifyContent="space-between">
                    <Select size="small" defaultValue={"IDLE"} value={state} onChange={handleStateChange} fullWidth>
                        <MenuItem value="IDLE">IDLE</MenuItem>
                        <MenuItem value="LOCKOUT">LOCKOUT</MenuItem>
                        <MenuItem value="ALWAYS ON">ALWAYS ON</MenuItem>
                    </Select>
                    <IconButton color="secondary">
                        <SendIcon/>
                    </IconButton>
                </Stack>
                <Typography variant="body1">placeholder-purple-slug</Typography>
                {
                    allowEdit
                    ? <Stack direction="row" justifyContent="flex-end">
                        <Button color="error" variant="contained" startIcon={<DeleteIcon />}>Delete</Button>
                    </Stack>
                    : null
                }
            </Stack>
        </Card>
    );
}