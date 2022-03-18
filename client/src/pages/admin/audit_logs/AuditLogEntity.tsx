import React from "react";
import { Link } from "@mui/material";
import { useHistory } from "react-router-dom";

interface AuditLogEntityProps {
  entityCode: string;
}

function getEntityUrl(entityType: string, id: string) {
  switch (entityType) {
    case "user":
      return "/admin/people/" + id;
    default:
      return "/admin/history";
  }
}

export default function AuditLogEntity({ entityCode }: AuditLogEntityProps) {
  const history = useHistory();

  const [entityType, id, label] = entityCode.split(":");

  const url = getEntityUrl(entityType, id);

  return (
    <Link onClick={() => history.push(url)} sx={{ cursor: "pointer" }}>
      {label}
    </Link>
  );
}
