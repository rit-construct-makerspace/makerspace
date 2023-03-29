import { gql, useMutation } from "@apollo/client";
import GET_EQUIPMENTS, { GET_ARCHIVED_EQUIPMENTS } from "../../../queries/equipments";
import { ObjectSummary } from "../../../types/Common";
import EquipmentEditor from "./EquipmentEditor";
import { Equipment, MutationCallback } from "./ManageEquipmentModal";

const CREATE_EQUIPMENT = gql`
  mutation CreateEquipment($name: String!, $roomID: ID!, $moduleIDs: [ID]!) {
    addEquipment(
      equipment: { name: $name, roomID: $roomID, moduleIDs: $moduleIDs }
    ) {
      id
    }
  }
`;

interface NewEquipmentProps {
  equipment: Equipment;
  setEquipment: (equipment: Equipment) => void;
  onSave: (mutation: MutationCallback, variables: object) => void;
}

export default function NewEquipmentEditor({
  equipment,
  setEquipment,
  onSave,
}: NewEquipmentProps) {
  const [createEquipment] = useMutation(CREATE_EQUIPMENT, {
    refetchQueries: [
      { query: GET_EQUIPMENTS },
      { query: GET_ARCHIVED_EQUIPMENTS }
    ],
  });

  return (
    <EquipmentEditor
      newEquipment={true}
      equipment={equipment}
      setEquipment={setEquipment}
      onSave={() =>
        onSave(createEquipment, {
          name: equipment.name,
          roomID: equipment.room?.id,
          moduleIDs: equipment.trainingModules.map((m: ObjectSummary) => m.id),
        })
      }
    />
  );
}
