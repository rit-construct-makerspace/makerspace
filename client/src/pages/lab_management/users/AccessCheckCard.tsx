import React from "react";
import { Card, CardActions, Stack, Typography } from "@mui/material";
import { AccessCheck, GET_USER, Hold } from "./UserModal";
import { gql, useMutation, useQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import AuditLogEntity from "../audit_logs/AuditLogEntity";
import { GET_ANY_EQUIPMENT_BY_ID, GET_EQUIPMENT_BY_ID } from "../../../queries/equipmentQueries";
import InfoBlob from "./InfoBlob";
import RequestWrapper from "../../../common/RequestWrapper";

const APPROVE_CHECK = gql`
  mutation ApproveAccessCheck($id: ID!) {
    approveAccessCheck(id: $id) {
      id
    }
  }
`;

const UNAPPROVE_CHECK = gql`
  mutation UnapproveAccessCheck($id: ID!) {
    unapproveAccessCheck(id: $id) {
      id
    }
  }
`;

interface AccessCheckCardProps {
  accessCheck: AccessCheck;
  userID: string;
}

export default function AccessCheckCard({ accessCheck, userID }: AccessCheckCardProps) {
  const [approveCheck, approveCheckResult] = useMutation(APPROVE_CHECK, {
    variables: { id: accessCheck.id },
    refetchQueries: [{ query: GET_USER, variables: { id: userID } }],
  });
  const [unapproveCheck, unapproveCheckResult] = useMutation(UNAPPROVE_CHECK, {
    variables: { id: accessCheck.id },
    refetchQueries: [{ query: GET_USER, variables: { id: userID } }],
  });

  const approved = accessCheck.approved;

  const equipment = useQuery(GET_ANY_EQUIPMENT_BY_ID, {variables: {id: accessCheck.equipmentID}});

  return (
    <RequestWrapper
    loading={equipment.loading}
    error={equipment.error}
    >
      <Card
        sx={{
          backgroundColor: !approved ? (localStorage.getItem("themeMode") == "dark" ? "grey.900" : "grey.100") : (localStorage.getItem("themeMode") == "dark" ? "lightGreen.800" : "lightGreen.100"),
          border: `1px solid ${!approved ? "grey" : "lime"}`,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '1em',
          paddingRight: '1em'
        }}
      >
        <div>
          <AuditLogEntity entityCode={"equipment:" + accessCheck.equipmentID + ":" + ((equipment.data != undefined && equipment.data.anyEquipment != undefined) ? equipment.data.anyEquipment.name : "Loading...")}></AuditLogEntity>
        </div>
        <CardActions sx={{ px: 2 }}>
          <span style={{paddingRight: '.5em'}}>
            <b>Status: </b>{accessCheck.approved ? "Approved" : "Pending Approval"}
          </span>
          {!approved && (
            <LoadingButton
              size="small"
              color="success"
              loading={approveCheckResult.loading}
              onClick={() => approveCheck()}
            >
              <b>Approve</b>
            </LoadingButton>
          )}
          {approved && (
            <LoadingButton
              size="small"
              color="error"
              loading={unapproveCheckResult.loading}
              onClick={() => unapproveCheck()}
            >
              Unapprove
            </LoadingButton>
          )}
        </CardActions>
      </Card>
    </RequestWrapper>
  );
}
