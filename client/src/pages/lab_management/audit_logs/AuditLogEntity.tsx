import React, { useState } from "react";
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
    case "conceal":
      return "#";
    case "access_device":
      return "/admin/readers";
    case "machine":
      return "/admin/readers";
    case "makerspace":
      return `/makerspace/${id}`;
    default:
      return "/admin/history";
  }
}

export default function AuditLogEntity({ entityCode }: AuditLogEntityProps) {
  const navigate = useNavigate();

  const [entityType, id, label] = entityCode.split(":");

  const url = getEntityUrl(entityType, id);

  const [reveal, setReveal] = useState(entityType != "conceal");

  const toggleConcealment = () => {
      setReveal(reveal => !reveal)
  }

  return (
    <span>
      {!reveal
      ? <Link onClick={toggleConcealment}>
      Click to Reveal
      </Link>
      : <Link onClick={() => navigate(url)} sx={{ cursor: "pointer" }}>
      {label}
      </Link>
      }
    </span>
  );
}
