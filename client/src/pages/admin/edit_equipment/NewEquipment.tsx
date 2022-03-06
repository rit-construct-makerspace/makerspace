import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import GET_EQUIPMENTS from "../../../queries/getEquipments";
import EquipmentEditor from "./EquipmentEditor";
import { useHistory } from "react-router-dom";
import { EquipmentInput } from "./EditEquipmentPage";

interface NewEquipmentProps {}

const CREATE_EQUIPMENT = gql`
  mutation CreateEquipment($name: String!, $roomID: ID!, $moduleIDs: [ID]!) {
    addEquipment(
      equipment: { name: $name, roomID: $roomID, trainingModules: $moduleIDs }
    ) {
      id
    }
  }
`;

export default function NewEquipment({}: NewEquipmentProps) {
  const history = useHistory();
  const [equipment, setEquipment] = useState<EquipmentInput>({
    name: "",
    room: null,
    modules: [],
  });

  const [createEquipment] = useMutation(CREATE_EQUIPMENT, {
    refetchQueries: [{ query: GET_EQUIPMENTS }],
  });

  const handleSave = async () => {
    if (!equipment.name) {
      window.alert("Please specify a name.");
      return;
    }

    if (!equipment.room) {
      window.alert("Please specify a room.");
    }

    await createEquipment({
      variables: {
        name: equipment.name,
        roomID: equipment.room?.id,
        moduleIDs: equipment.modules.map((m) => m.id),
      },
    });
    history.push("/admin/equipment");
  };

  return (
    <EquipmentEditor
      newEquipment={false}
      equipment={equipment}
      setEquipment={setEquipment}
      onSave={handleSave}
    />
  );
}
