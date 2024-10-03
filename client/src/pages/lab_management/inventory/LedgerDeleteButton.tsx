import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, IconButton } from "@mui/material";
import { useMutation } from "@apollo/client";
import { DELETE_INVENTORY_LEDGER, GET_LEDGERS } from "../../../queries/inventoryQueries";
import DeleteIcon from '@mui/icons-material/Delete';

const CONFIRM_PROMPT =
  "Are you sure you want to delete this material? This cannot be undone.";

interface LedgerDeleteButtonProps {
  itemID: number
}

export default function LedgerDeleteButton({itemID}: LedgerDeleteButtonProps){
    const [deleteLedger] = useMutation(DELETE_INVENTORY_LEDGER, {variables: {id: itemID}, refetchQueries: [{query: GET_LEDGERS}]});

  const handleClick = () => {
    if (!window.confirm(CONFIRM_PROMPT)) return;
    deleteLedger();
  };

  return (
    <IconButton color="error" onClick={handleClick}><DeleteIcon /></IconButton>
  );
}
