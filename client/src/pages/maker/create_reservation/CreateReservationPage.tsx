import React from "react";
import { useParams } from "react-router-dom";
import Page from "../../Page";
import { gql, useQuery } from "@apollo/client";
import RequestWrapper2 from "../../../common/RequestWrapper2";

const GET_EQUIPMENT_AND_TIMESLOTS = gql`
  query GetEquipmentAndTimeslots($equipmentID: ID!) {
    equipment(id: $equipmentID) {
      name
      timeslots {
        time
        available
      }
    }
  }
`;

export default function CreateReservationPage() {
  const { id } = useParams();
  const result = useQuery(GET_EQUIPMENT_AND_TIMESLOTS, {
    variables: { equipmentID: id },
  });

  return (
    <RequestWrapper2
      result={result}
      render={(data) => <Page title="Create a reservation" />}
    />
  );
}
