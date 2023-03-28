import ArchiveIcon from "@mui/icons-material/Archive";
import { useMutation } from "@apollo/client";
import GET_EQUIPMENTS, { ARCHIVE_EQUIPMENT, GET_ARCHIVED_EQUIPMENTS, GET_ARCHIVED_EQUIPMENT_BY_ID } from "../../../queries/equipments";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { useState } from "react";

interface ArchiveEquipmentButtonProps {
  equipmentID: number;
  appearance: "icon-only" | "small" | "medium" | "large"
}

export default function ArchiveEquipmentButton(props: ArchiveEquipmentButtonProps) {
  const navigate = useNavigate();

  const [deleteEquipment, { loading }] = useMutation(ARCHIVE_EQUIPMENT, {
    variables: { id: props.equipmentID },
    refetchQueries: [
      { query: GET_EQUIPMENTS },
      { query: GET_ARCHIVED_EQUIPMENTS },
      { query: GET_ARCHIVED_EQUIPMENT_BY_ID, variables: { id: props.equipmentID } },
    ],
  });

  const handleClick = async () => {
    await deleteEquipment();
    navigate("/admin/equipment");
  };

  let size: "small" | "medium" | "large";
  switch(props.appearance) {
    case "large":
      size = "large"
      break;
    case "medium":
      size = "medium"
      break;
    default:
      size = "small"
  }

  const iconSize = 25;

  if (props.appearance !== "icon-only") {
    return (
      <LoadingButton
        loading={loading}
        variant="outlined"
        startIcon={<ArchiveIcon />}
        color="error"
        onClick={handleClick}
        loadingPosition="start"
      >
        Archive
      </LoadingButton>
    );
  }
  else {
    return (
      <IconButton
        color="error"
        onClick={handleClick}>
        {
          loading
            ? <CircularProgress
            color="error"
            size={iconSize}
          />
            : <ArchiveIcon sx={{fontSize: iconSize}} />
        }
      </IconButton>
    );
  }
}
