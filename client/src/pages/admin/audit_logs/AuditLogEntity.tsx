import React from "react";
import { Link } from "@mui/material";
import { useHistory } from "react-router-dom";

interface AuditLogEntityProps {
  entityCode: string;
}

export default function AuditLogEntity({ entityCode }: AuditLogEntityProps) {
  const history = useHistory();
  const [entityType, id, label] = entityCode.split(":");

  return (
    <Link onClick={() => history.push("/")} sx={{ cursor: "pointer" }}>
      {label}
    </Link>
  );
}
