import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NewEquipment from "./NewEquipment";
import ExistingEquipment from "./ExistingEquipment";

export type MutationCallback = (options: object) => void;

export interface NameAndID {
  id: number;
  name: string;
}

export interface EquipmentInput {
  name: string;
  room: NameAndID | null;
  trainingModules: NameAndID[];
}

export default function ManageEquipmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState<EquipmentInput>({
    name: "",
    room: null,
    trainingModules: [],
  });

  const newEquipment = id === "new";

  const handleSave = async (mutation: MutationCallback, variables: object) => {
    if (!equipment.name) {
      window.alert("Please specify a name.");
      return;
    }

    if (!equipment.room) {
      window.alert("Please specify a room.");
    }

    await mutation({ variables });

    navigate("/admin/equipment");
  };

  return newEquipment ? (
    <NewEquipment
      equipment={equipment}
      setEquipment={setEquipment}
      onSave={handleSave}
    />
  ) : (
    <ExistingEquipment
      equipment={equipment}
      setEquipment={setEquipment}
      onSave={handleSave}
    />
  );
}
