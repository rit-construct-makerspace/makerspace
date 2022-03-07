import React, { ChangeEventHandler, SyntheticEvent } from "react";
import Page from "../../Page";
import { Autocomplete, Button, Divider, Stack, TextField } from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import HistoryIcon from "@mui/icons-material/History";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { useQuery } from "@apollo/client";
import GET_TRAINING_MODULES from "../../../queries/getModules";
import RequestWrapper from "../../../common/RequestWrapper";
import styled from "styled-components";
import GET_ROOMS from "../../../queries/getRooms";
import { EquipmentInput, NameAndID } from "./ManageEquipmentPage";
import AttachedModule from "./AttachedModule";

const StyledMachineImage = styled.img`
  width: 128px;
  height: 128px;
  border-radius: 4px;
`;

interface EquipmentEditorProps {
  newEquipment: boolean;
  equipment: EquipmentInput;
  setEquipment: (equipment: EquipmentInput) => void;
  onSave: () => void;
}

export default function EquipmentEditor({
  newEquipment,
  equipment,
  setEquipment,
  onSave,
}: EquipmentEditorProps) {
  const getRoomsResult = useQuery(GET_ROOMS);
  const getModulesResult = useQuery(GET_TRAINING_MODULES);

  const getModuleOptions = (): NameAndID[] => {
    if (!getModulesResult.data) return [];

    const attachedIDs = equipment.trainingModules.map((m) => m.id);

    return getModulesResult.data.modules.filter(
      (m: NameAndID) => !attachedIDs.includes(m.id)
    );
  };

  const handleNameChanged: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEquipment({ ...equipment, name: e.target.value });
  };

  const handleRoomChanged = (e: SyntheticEvent, value: NameAndID | null) => {
    if (!value) return;
    setEquipment({
      ...equipment,
      room: value,
    });
  };

  const handleModuleAdded = (e: SyntheticEvent, value: NameAndID | null) => {
    if (!value) return;
    setEquipment({
      ...equipment,
      trainingModules: [...equipment.trainingModules, value],
    });
  };

  const handleModuleRemoved = (id: number) => () => {
    setEquipment({
      ...equipment,
      trainingModules: equipment.trainingModules.filter((e) => e.id !== id),
    });
  };

  return (
    <RequestWrapper
      loading={getRoomsResult.loading || getModulesResult.loading}
      error={getRoomsResult.error || getModulesResult.error}
    >
      <Page
        title={`${newEquipment ? "Create new" : "Manage"} equipment`}
        maxWidth="800px"
      >
        {!newEquipment && (
          <Stack direction="row" spacing={1} sx={{ mt: -2, mb: 4 }}>
            <Button variant="outlined" startIcon={<EngineeringIcon />}>
              Schedule Maintenance
            </Button>
            <Button variant="outlined" startIcon={<HistoryIcon />}>
              View Logs
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              color="error"
            >
              Delete
            </Button>
          </Stack>
        )}

        <PageSectionHeader top>Information</PageSectionHeader>

        <Stack direction="row" spacing={2}>
          <StyledMachineImage
            alt="Machine image"
            src="https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp"
          />
          <Stack spacing={2} flexGrow={1}>
            <TextField
              label="Name"
              value={equipment.name}
              onChange={handleNameChanged}
            />
            <Autocomplete
              renderInput={(params) => (
                <TextField {...params} label="Location" />
              )}
              /* Autocomplete's value prop wants undefined, not null.
               * But if we give it undefined then it thinks it's an
               * uncontrolled prop and throws a console error
               * when we set the value. This is a MUI problem.
               * @ts-ignore */
              value={equipment.room}
              options={getRoomsResult.data?.rooms ?? []}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.name}
              onChange={handleRoomChanged}
              disableClearable
            />
          </Stack>
        </Stack>

        <PageSectionHeader>Training Modules</PageSectionHeader>

        <Stack divider={<Divider flexItem />} spacing={1}>
          {equipment.trainingModules.map((m) => (
            <AttachedModule
              module={m}
              key={m.id}
              onRemove={handleModuleRemoved(m.id)}
            />
          ))}
        </Stack>

        <Autocomplete
          key={equipment.trainingModules.length}
          renderInput={(params) => (
            <TextField {...params} label="Attach module" />
          )}
          options={getModuleOptions()}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          onChange={handleModuleAdded}
        />

        <Button
          variant="contained"
          size="large"
          sx={{ mt: 4, alignSelf: "flex-end" }}
          onClick={onSave}
        >
          Save
        </Button>
      </Page>
    </RequestWrapper>
  );
}
