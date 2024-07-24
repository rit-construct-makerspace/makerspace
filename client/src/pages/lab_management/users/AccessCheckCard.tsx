import React from "react";
import { Card, CardActions, Stack, Typography } from "@mui/material";
import { AccessCheck, GET_USER, Hold } from "./UserModal";
import { gql, useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import AuditLogEntity from "../audit_logs/AuditLogEntity";

const APPROVE_CHECK = gql`
  mutation ApproveCheck($id: ID!) {
    approveCheck(id: $id) {
      id
    }
  }
`;

const UNAPPROVE_CHECK = gql`
  mutation UnapproveCheck($id: ID!) {
    unapproveCheck(id: $id) {
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

  const approved = accessCheck.approved

  return (
    <Card
      sx={{
        backgroundColor: approved ? "grey.100" : "#fafff8",
        border: `1px solid ${approved ? "grey" : "lime"}`,
      }}
    >
      <AuditLogEntity entityCode={"equipment:" + accessCheck.equipment.id + ":" + accessCheck.equipment.name}></AuditLogEntity>
      <CardActions sx={{ px: 2 }}>
        {!approved && (
          <LoadingButton
            size="small"
            color="success"
            loading={approveCheckResult.loading}
            onClick={() => approveCheck()}
          >
            Approve
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
  );
}
