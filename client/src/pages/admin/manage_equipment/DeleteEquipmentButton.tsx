import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { gql, useMutation } from "@apollo/client";
import GET_EQUIPMENTS from "../../../queries/getEquipments";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";

const DELETE_EQUIPMENT = gql`
  mutation DeleteEquipment($id: ID!) {
    removeEquipment(id: $id) {
      id
    }
  }
`;

export default function DeleteEquipmentButton() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deleteEquipment, { loading }] = useMutation(DELETE_EQUIPMENT, {
    variables: { id },
    refetchQueries: [{ query: GET_EQUIPMENTS }],
  });

  const handleClick = async () => {
    await deleteEquipment();
    navigate("/admin/equipment");
  };

  return (
    <LoadingButton
      loading={loading}
      variant="outlined"
      startIcon={<DeleteOutlineIcon />}
      color="error"
      onClick={handleClick}
    >
      Delete
    </LoadingButton>
  );
}
