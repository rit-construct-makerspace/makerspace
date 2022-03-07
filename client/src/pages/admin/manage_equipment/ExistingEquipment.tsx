import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { EquipmentInput, MutationCallback } from "./ManageEquipmentPage";
import { gql, useMutation, useQuery } from "@apollo/client";
import GET_EQUIPMENTS from "../../../queries/getEquipments";
import EquipmentEditor from "./EquipmentEditor";
import RequestWrapper from "../../../common/RequestWrapper";

const GET_EQUIPMENT = gql`
  query GetEquipment($id: ID!) {
    equipment(id: $id) {
      name
      room {
        id
        name
      }
      trainingModules {
        id
        name
      }
    }
  }
`;

const UPDATE_EQUIPMENT = gql`
  mutation UpdateEquipment(
    $id: ID!
    $name: String!
    $roomID: ID!
    $moduleIDs: [ID]!
  ) {
    updateEquipment(
      id: $id
      equipment: { name: $name, roomID: $roomID, trainingModules: $moduleIDs }
    ) {
      id
    }
  }
`;

interface ExistingEquipmentProps {
  equipment: EquipmentInput;
  setEquipment: (equipment: EquipmentInput) => void;
  onSave: (mutation: MutationCallback, options: object) => void;
}

export default function ExistingEquipment({
  equipment,
  setEquipment,
  onSave,
}: ExistingEquipmentProps) {
  const { id } = useParams<{ id: string }>();

  const getEquipmentResult = useQuery(GET_EQUIPMENT, { variables: { id } });

  const [updateEquipment] = useMutation(UPDATE_EQUIPMENT, {
    refetchQueries: [
      { query: GET_EQUIPMENTS },
      { query: GET_EQUIPMENT, variables: { id } },
    ],
  });

  useEffect(() => {
    const queriedEquipment = getEquipmentResult.data?.equipment;

    if (!queriedEquipment) return;

    setEquipment(queriedEquipment);
  }, [getEquipmentResult.data, setEquipment]);

  return (
    <RequestWrapper
      loading={getEquipmentResult.loading}
      error={getEquipmentResult.error}
    >
      <EquipmentEditor
        newEquipment={false}
        equipment={equipment}
        setEquipment={setEquipment}
        onSave={() =>
          onSave(updateEquipment, {
            id,
            name: equipment.name,
            roomID: equipment.room?.id,
            moduleIDs: equipment.trainingModules.map((m) => m.id),
          })
        }
      />
    </RequestWrapper>
  );
}
