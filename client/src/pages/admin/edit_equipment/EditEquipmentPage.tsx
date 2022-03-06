import React from "react";
import { useParams } from "react-router-dom";
import NewEquipment from "./NewEquipment";
import ExistingEquipment from "./ExistingEquipment";

export interface NameAndID {
  id: number;
  name: string;
}

export interface EquipmentInput {
  name: string;
  room: NameAndID | null;
  modules: NameAndID[];
}

export default function EditEquipmentPage() {
  const { id } = useParams<{ id: string }>();

  const newEquipment = id === "new";

  return newEquipment ? <NewEquipment /> : <ExistingEquipment />;
}
