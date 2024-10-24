import { Card, Stack, Typography, Select, MenuItem, TextField, Divider } from "@mui/material";
import ActionButton from "../../../common/ActionButton";
import { DELETE_EQUIPMENT_INSTANCE, EquipmentInstance, GET_EQUIPMENT_INSTANCES, InstanceStatus, SET_INSTANCE_NAME, SET_INSTANCE_STATUS } from "../../../queries/equipmentInstanceQueries";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from "react";
import { useMutation } from "@apollo/client";


export default function EquipmentInstanceRow({ instance }: { instance: EquipmentInstance }) {
  const [status, setStatus] = useState<InstanceStatus>(instance.status);
  const [name, setName] = useState<string>(instance.name);

  const [allowRename, setAllowRename] = useState<boolean>(false);

  const [setInstanceStatus] = useMutation(SET_INSTANCE_STATUS, { refetchQueries: [{ query: GET_EQUIPMENT_INSTANCES, variables: {equipmentID: instance.equipment.id} }] });
  const [setInstanceName] = useMutation(SET_INSTANCE_NAME, { refetchQueries: [{ query: GET_EQUIPMENT_INSTANCES, variables: {equipmentID: instance.equipment.id} }] });
  const [deleteInstance] = useMutation(DELETE_EQUIPMENT_INSTANCE, { refetchQueries: [{ query: GET_EQUIPMENT_INSTANCES, variables: {equipmentID: instance.equipment.id} }] });


  function handleStatusChange(e: any) {
    setStatus(e.target.value);
    setInstanceStatus({ variables: { id: instance.id, status: e.target.value } })
  }

  async function handlenameChangeSubmit() {
    setAllowRename(false);
    setInstanceName({ variables: { id: instance.id, name } })
  }

  async function handlenameChangeCancel() {
    setAllowRename(false);
    setName(instance.name)
  }

  return (
    <Card sx={{p: 2}}>
      <Stack direction={"row"} spacing={2} alignItems={"center"} justifyContent={"space-between"} divider={<Divider />} sx={{ width: "100%" }}>
        <Stack direction={"row"} alignItems={"center"} spacing={4}>
          {!allowRename ? <Typography variant="h6" fontWeight={"bold"} width={150}>{instance.name}</Typography>
            : <TextField size="small" value={name} onChange={(e) => setName(e.target.value)}></TextField>}
          <Typography color={"secondary"} width={60}>ID {instance.id}</Typography>
          <Select size="small" defaultValue={instance.status} value={status} onChange={handleStatusChange}>
            <MenuItem value={InstanceStatus.ACTIVE}>{InstanceStatus.ACTIVE}</MenuItem>
            <MenuItem value={InstanceStatus.NEEDS_REPAIRS}>{InstanceStatus.NEEDS_REPAIRS}</MenuItem>
            <MenuItem value={InstanceStatus.UNDER_REPAIRS}>{InstanceStatus.UNDER_REPAIRS}</MenuItem>
            <MenuItem value={InstanceStatus.TESTING}>{InstanceStatus.TESTING}</MenuItem>
            <MenuItem value={InstanceStatus.UNDEPLOYED}>{InstanceStatus.UNDEPLOYED}</MenuItem>
            <MenuItem value={InstanceStatus.RETIRED}>{InstanceStatus.RETIRED}</MenuItem>
          </Select>
        </Stack>
        <Stack direction={"row"} alignSelf={"flex-end"} spacing={2} alignItems={"center"}>
          {!allowRename
            ? <>
              <ActionButton iconSize={20} color={"primary"} appearance={"icon-only"} tooltipText="Rename" handleClick={async () => setAllowRename(true)}
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
      </Stack>
    </Card>
  )
}