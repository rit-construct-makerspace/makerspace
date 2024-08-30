import { ChangeEventHandler, SyntheticEvent } from "react";
import Page from "../../Page";
import { Autocomplete, Button, Divider, Stack, TextField } from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import HistoryIcon from "@mui/icons-material/History";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { useQuery } from "@apollo/client";
import { GET_TRAINING_MODULES } from "../../../queries/trainingQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import styled from "styled-components";
import GET_ROOMS from "../../../queries/getRooms";
import { Equipment } from "./EditEquipmentPage";
import AttachedModule from "./AttachedModule";
import ArchiveEquipmentButton from "./ArchiveEquipmentButton";
import PublishEquipmentButton from "./PublishEquipmentButton";
import { ObjectSummary } from "../../../types/Common";
import AdminPage from "../../AdminPage";

const StyledMachineImage = styled.img`
  width: 128px;
  height: 128px;
  border-radius: 4px;
`;

interface EquipmentEditorProps {
  newEquipment: boolean;
  equipment: Equipment;
  setEquipment: (equipment: Equipment) => void;
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

  const getModuleOptions = (): ObjectSummary[] => {
    if (!getModulesResult.data) return [];

    const attachedIDs = equipment.trainingModules.map((m) => m.id);

    return getModulesResult.data.modules.filter(
      (m: ObjectSummary) => !attachedIDs.includes(m.id)
    );
  };

  const handleNameChanged: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEquipment({ ...equipment, name: e.target.value });
  };

  const handleRoomChanged = (e: SyntheticEvent, value: ObjectSummary | null) => {
    if (!value) return;
    setEquipment({
      ...equipment,
      room: value,
    });
  };

  const handleModuleAdded = (e: SyntheticEvent, value: ObjectSummary | null) => {
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
      <AdminPage
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
            {
              equipment.id ?
                equipment.archived
                  ? <PublishEquipmentButton equipmentID={equipment.id} appearance="medium" /> 
                  : <ArchiveEquipmentButton equipmentID={equipment.id} appearance="medium" />
                : null
            }
          </Stack>
        )}

        <PageSectionHeader top>Information</PageSectionHeader>

        <Stack direction="row" spacing={2}>
          <StyledMachineImage
            alt="Machine image"
            src={(equipment.imageUrl == undefined || equipment.imageUrl == null ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : process.env.PUBLIC_URL + "/" + equipment.imageUrl)}
          />
          <Stack spacing={2} flexGrow={1}>
            <TextField
              label="Name"
              value={equipment.name}
              onChange={handleNameChanged}
              inputProps={{
                maxLength: 50
              }}
            />
            <Autocomplete
              renderInput={(params: any) => (
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
          renderOption={(params, module) => (
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

        <Button
          variant="contained"
          size="large"
          sx={{ mt: 4, alignSelf: "flex-end" }}
          onClick={onSave}
        >
          Save
        </Button>
      </AdminPage>
    </RequestWrapper>
  );
}
