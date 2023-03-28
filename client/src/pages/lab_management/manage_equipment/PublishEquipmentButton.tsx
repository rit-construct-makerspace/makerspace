import SendIcon from "@mui/icons-material/Send";
import { gql, useMutation } from "@apollo/client";
import GET_EQUIPMENTS, { GET_ARCHIVED_EQUIPMENTS, GET_EQUIPMENT_BY_ID, PUBLISH_EQUIPMENT } from "../../../queries/equipments";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { CircularProgress, IconButton } from "@mui/material";
import { useState } from "react";

interface PublishEquipmentButtonProps {
  equipmentID: number;
  appearance: "icon-only" | "small" | "medium" | "large"
}

export default function PublishEquipmentButton(props: PublishEquipmentButtonProps) {
  const navigate = useNavigate();

  const [deleteEquipment, { loading }] = useMutation(PUBLISH_EQUIPMENT, {
    variables: { id: props.equipmentID },
    refetchQueries: [
      { query: GET_EQUIPMENTS },
      { query: GET_ARCHIVED_EQUIPMENTS },
      { query: GET_EQUIPMENT_BY_ID, variables: { id: props.equipmentID } },
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
        startIcon={<SendIcon />}
        color="success"
        onClick={handleClick}
        loadingPosition="start"
      >
        Publish
      </LoadingButton>
    );
  }
  else {
    return (
      <IconButton
        color="success"
        onClick={handleClick}>
        {
          loading
            ? <CircularProgress
            color="success"
            size={iconSize}
          />
            : <SendIcon sx={{fontSize: iconSize}} />
        }
      </IconButton>
    );
  }
}
