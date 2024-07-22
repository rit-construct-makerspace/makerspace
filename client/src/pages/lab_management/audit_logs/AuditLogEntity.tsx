import React from "react";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface AuditLogEntityProps {
  entityCode: string;
}

function getEntityUrl(entityType: string, id: string) {
  switch (entityType) {
    case "user":
      return "/admin/people/" + id;
    case "room":
      return "/admin/rooms/" + id;
    case "equipment":
      return "/admin/equipment/" + id;
    case "module":
      return "/admin/training/" + id;
    default:
      return "/admin/history";
  }
}

export default function AuditLogEntity({ entityCode }: AuditLogEntityProps) {
  const navigate = useNavigate();

  const [entityType, id, label] = entityCode.split(":");

  const url = getEntityUrl(entityType, id);

  return (
    <Link onClick={() => navigate(url)} sx={{ cursor: "pointer" }}>
      {label}
    </Link>
  );
}
