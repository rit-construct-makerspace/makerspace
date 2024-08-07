import PrettyModal from "../../../common/PrettyModal";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_EQUIPMENT_BY_ID } from "../../../queries/equipmentQueries";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { Avatar, Button, Divider, Icon, Stack, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import TrainingModuleRow from "../../../common/TrainingModuleRow";
import {
  ModuleStatus,
  moduleStatusMapper,
} from "../../../common/TrainingModuleUtils";
import CloseButton from "../../../common/CloseButton";

interface EquipmentModalProps {
  equipmentID: string;
}

export default function EquipmentModal({ equipmentID }: EquipmentModalProps) {
  const navigate = useNavigate();
  const { passedModules } = useCurrentUser();

  const result = useQuery(GET_EQUIPMENT_BY_ID, { variables: { id: equipmentID } });

  return (
    <PrettyModal
      open={!!equipmentID}
      onClose={() => navigate("/maker/equipment")}
    >
      <RequestWrapper2
        result={result}
        render={({ equipment }) => {
          const moduleStatuses = equipment.trainingModules.map(
            moduleStatusMapper(passedModules)
          );

          const reservationReady = moduleStatuses.every(
            (ms: ModuleStatus) => ms.status === "Passed"
          );

          return (
            <Stack>
             <CloseButton onClick={() => navigate("/maker/equipment")}/>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{ width: 80, height: 80 }}
                  src={(equipment.imageUrl == undefined || equipment.imageUrl == null ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : process.env.PUBLIC_URL + "/" + equipment.imageUrl)}
                />
                <Stack>
                  <Typography variant="h4">{equipment.name}</Typography>
                  <Typography>{equipment.room.name}</Typography>
                </Stack>
              </Stack>

              <Typography variant="h6" sx={{ mt: 6 }} hidden={moduleStatuses.length==0 ? true : undefined}>
                Required training
              </Typography>

              <Stack divider={<Divider flexItem />} mb={6} hidden={moduleStatuses.length==0 ? true : undefined}>
                {moduleStatuses.map((ms: ModuleStatus) => (
                  <TrainingModuleRow key={ms.moduleID} moduleStatus={ms} />
                ))}
              </Stack>

              <Button
                startIcon={<EventIcon />}
                variant="contained"
                onClick={() => navigate("/create-reservation")}
                //disabled={!reservationReady}
                disabled={true}
              >
                Reservation Service Unavailable
              </Button>
              
            </Stack>
          );
        }}
      />
    </PrettyModal>
  );
}
