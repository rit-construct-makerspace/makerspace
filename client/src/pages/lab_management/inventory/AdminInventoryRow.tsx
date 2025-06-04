import React, { useState } from "react";
import { CardActionArea, Chip, IconButton, MenuItem, Select, Stack, Switch, TableCell, TableRow, Typography } from "@mui/material";
import InvItemName from "../../../common/InvItemNamePic";
import InventoryItem, { InventoryTag } from "../../../types/InventoryItem";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useMutation } from "@apollo/client";
import { ADD_TAG_TO_ITEM, GET_INVENTORY_ITEMS, GET_INVENTORY_TAGS, REMOVE_TAG_FROM_ITEM, SET_STAFF_ONLY, SET_STOREFRONT_VISIBLE } from "../../../queries/inventoryQueries";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import InventoryTagChip from "./InventoryTagChip";
import { MaintenanceTag } from "../../../queries/maintenanceLogQueries";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { isManager } from "../../../common/PrivilegeUtils";

interface InventoryRowProps {
  item: InventoryItem;
  onClick: () => void;
  allTags: InventoryTag[];
}

export default function AdminInventoryRow({ item, onClick, allTags }: InventoryRowProps) {
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

  const [addTag] = useMutation(ADD_TAG_TO_ITEM, {
    refetchQueries: [{ query: GET_INVENTORY_ITEMS }] });

  const [removeTag] = useMutation(REMOVE_TAG_FROM_ITEM, {
    refetchQueries: [{ query: GET_INVENTORY_ITEMS }] });

  const handleRemoveTagClick = (id: number) => {
    removeTag({variables: {itemID: item.id, tagID: id}});
  }

  const [showTagsDropdown, setShowTagsDropdown] = useState<boolean>(false);

  const handleAddTagClick = (id: number) => {
    addTag({variables: {itemID: item.id, tagID: id}});
    setShowTagsDropdown(false);
  }

  const currentUser = useCurrentUser();

  return (
    <TableRow sx={{ py: 2 }}>
      <TableCell><InvItemName item={item} /></TableCell>

      <TableCell>
        <Stack direction={"row"} flexWrap={"wrap"}>
          {item.tags && item.tags.map((tag: InventoryTag) => (
            tag && <InventoryTagChip id={tag.id} label={tag.label} color={tag.color} removeTag={handleRemoveTagClick}/>
          ))}
          <div style={{alignSelf: 'flex-end'}}>
            <IconButton onClick={() => setShowTagsDropdown(!showTagsDropdown)}>{showTagsDropdown ? <ExpandLessIcon /> : <AddCircleIcon />}</IconButton>
            {showTagsDropdown && 
            <Select defaultOpen={showTagsDropdown}>
              {allTags.map((tag: InventoryTag) => (
                <MenuItem onClick={() => handleAddTagClick(tag.id)}><Chip variant="outlined" color={tag.color as ("default" | "primary" | "secondary" | "warning" | "info" | "error" | "success")} label={tag.label} /></MenuItem>
              ))}
            </Select>}
          </div>
        </Stack>
      </TableCell>

      <TableCell>{item.count}</TableCell>

      <TableCell>${item.pricePerUnit.toFixed(2)}</TableCell>

      <TableCell><Switch onChange={handleToggleStaffOnly} disabled={!isManager(currentUser)} defaultChecked={item.staffOnly}></Switch></TableCell>

      <TableCell><Switch onChange={handleToggleStorefrontVisible} disabled={item.staffOnly && !isManager(currentUser)} defaultChecked={item.storefrontVisible}></Switch></TableCell>

      <TableCell><IconButton onClick={onClick} disabled={item.staffOnly && !isManager(currentUser)} defaultChecked={item.storefrontVisible}><ModeEditIcon /></IconButton></TableCell>
    </TableRow>
  );
}
