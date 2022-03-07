import React from "react";
import { gql, useMutation } from "@apollo/client";
import GET_EQUIPMENTS from "../../../queries/getEquipments";
import EquipmentEditor from "./EquipmentEditor";
import { EquipmentInput, MutationCallback } from "./ManageEquipmentPage";

const CREATE_EQUIPMENT = gql`
  mutation CreateEquipment($name: String!, $roomID: ID!, $moduleIDs: [ID]!) {
    addEquipment(
      equipment: { name: $name, roomID: $roomID, trainingModules: $moduleIDs }
    ) {
      id
    }
  }
`;

interface NewEquipmentProps {
  equipment: EquipmentInput;
  setEquipment: (equipment: EquipmentInput) => void;
  onSave: (mutation: MutationCallback, variables: object) => void;
}

export default function NewEquipment({
  equipment,
  setEquipment,
  onSave,
}: NewEquipmentProps) {
  const [createEquipment] = useMutation(CREATE_EQUIPMENT, {
    refetchQueries: [{ query: GET_EQUIPMENTS }],
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
          moduleIDs: equipment.trainingModules.map((m) => m.id),
        })
      }
    />
  );
}
