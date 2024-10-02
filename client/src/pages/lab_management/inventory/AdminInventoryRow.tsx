import React from "react";
import { CardActionArea, IconButton, Stack, Switch, TableCell, TableRow, Typography } from "@mui/material";
import InvItemNamePic from "../../../common/InvItemNamePic";
import InventoryItem from "../../../types/InventoryItem";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useMutation } from "@apollo/client";
import { GET_INVENTORY_ITEMS, SET_STAFF_ONLY, SET_STOREFRONT_VISIBLE } from "../../../queries/inventoryQueries";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Privilege from "../../../types/Privilege";

interface InventoryRowProps {
  item: InventoryItem;
  onClick: () => void;
}

export default function AdminInventoryRow({ item, onClick }: InventoryRowProps) {
  const [setStaffOnly, setStaffOnlyMutation] = useMutation(SET_STAFF_ONLY, {
    variables: {id: item.id, staffOnly: !item.staffOnly}, 
    refetchQueries: [{query: GET_INVENTORY_ITEMS}]});
  const [setStorefront, setStorefrontMutation] = useMutation(SET_STOREFRONT_VISIBLE, {
    variables: {id: item.id, storefrontVisible: !item.storefrontVisible}, 
    refetchQueries: [{query: GET_INVENTORY_ITEMS}]});

  function handleToggleStaffOnly() {
    setStaffOnly();
  }

  function handleToggleStorefrontVisible() {
    setStorefront();
  }

  const currentUser = useCurrentUser();

  return (
    <TableRow sx={{ py: 2 }}>
      <TableCell><InvItemNamePic item={item} /></TableCell>

      <TableCell>{item.count}</TableCell>

      <TableCell>${item.pricePerUnit.toFixed(2)}</TableCell>

      <TableCell><Switch onChange={handleToggleStaffOnly} disabled={currentUser.privilege != Privilege.STAFF} defaultChecked={item.staffOnly}></Switch></TableCell>

      <TableCell><Switch onChange={handleToggleStorefrontVisible} disabled={item.staffOnly && currentUser.privilege != Privilege.STAFF} defaultChecked={item.storefrontVisible}></Switch></TableCell>

      <TableCell><IconButton onClick={onClick} disabled={item.staffOnly && currentUser.privilege != Privilege.STAFF} defaultChecked={item.storefrontVisible}><ModeEditIcon /></IconButton></TableCell>
    </TableRow>
  );
}
