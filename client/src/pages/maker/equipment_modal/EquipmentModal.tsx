import React from "react";
import PrettyModal from "../../../common/PrettyModal";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_EQUIPMENT } from "../../admin/manage_equipment/ExistingEquipment";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { Avatar, Button, Divider, Icon, Stack, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import TrainingModuleRow from "../../../common/TrainingModuleRow";
import {
  ModuleStatus,
  moduleStatusMapper,
} from "../../../common/TrainingModuleUtils";
import { HideSource } from "@mui/icons-material";
import CloseButton from "../../../common/CloseButton";

interface EquipmentModalProps {
  equipmentID: string;
}

export default function EquipmentModal({ equipmentID }: EquipmentModalProps) {
  const navigate = useNavigate();
  const { passedModules } = useCurrentUser();

  const result = useQuery(GET_EQUIPMENT, { variables: { id: equipmentID } });

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

              <Button
              sx={{ width: 2, height: 20 }}
              onClick={() => navigate("/maker/equipment")}
              style={{
                position: 'absolute',
                right: 5,
                top: 20,
                }}
              >
                X
              </Button>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{ width: 80, height: 80 }}
                  src="https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp"
                />
                <Stack>
                  <Typography variant="h4">{equipment.name}</Typography>
                  <Typography>{equipment.room.name}</Typography>
                </Stack>
              </Stack>

              <Typography variant="h6" sx={{ mt: 6 }}>
                Required training
              </Typography>

              <Stack divider={<Divider flexItem />} mb={6}>
                {moduleStatuses.map((ms: ModuleStatus) => (
                  <TrainingModuleRow key={ms.moduleID} moduleStatus={ms} />
                ))}
              </Stack>

              <Button
                startIcon={<EventIcon />}
                variant="contained"
                disabled={!reservationReady}
              >
                Create reservation
              </Button>
              
            </Stack>
          );
        }}
      />
    </PrettyModal>
  );
}
