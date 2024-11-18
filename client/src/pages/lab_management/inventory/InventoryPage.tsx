import React, { useState } from "react";
import Page from "../../Page";
import { Box, Button, Divider, Stack, Table, TableCell, TableHead, TableRow } from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { useNavigate } from "react-router-dom";
import InventoryRow from "../../../common/InventoryRow";
import CreateIcon from "@mui/icons-material/Create";
import { useQuery } from "@apollo/client";
import InventoryItem from "../../../types/InventoryItem";
import RequestWrapper from "../../../common/RequestWrapper";
import MaterialModal from "./MaterialModal";
import { GET_INVENTORY_ITEMS, GET_INVENTORY_TAGS } from "../../../queries/inventoryQueries";
import AdminPage from "../../AdminPage";
import AdminInventoryRow from "./AdminInventoryRow";
import Ledger from "./Ledger";
import InventoryTagsModal from "./InventoryTagsModal";

function sortItemsByName(items: InventoryItem[]): InventoryItem[] {
  return [...items].sort((a, b) => (a.name > b.name ? 1 : -1)) ?? [];
}

export default function InventoryPage() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState<string>("");
  const [modalItemId, setModalItemId] = useState<string>("");
  const [tagsModalOpen, setTagsModalOpen] = useState<boolean>(false);

  const inventoryTagsResult = useQuery(GET_INVENTORY_TAGS);

  const { loading, error, data } = useQuery(GET_INVENTORY_ITEMS);

  const safeData = data?.InventoryItems ?? [];
  const sortedItems = sortItemsByName(safeData);
  const lowItems = sortedItems.filter((i: any) => i.count < i.threshold);
  const matchingItems = sortedItems.filter((i: any) => i.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <RequestWrapper loading={loading} error={error}>
      <AdminPage title="Inventory" maxWidth="1250px" topRightAddons={(<Button variant="outlined" onClick={() => setTagsModalOpen(true)}>Manage Tags</Button>)}>
        <PageSectionHeader top>Running Low</PageSectionHeader>

        <Box sx={{width: "100%", overflowX: "scroll"}}>
          <Table>
            <TableHead>
              <TableCell>Item</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Units Available</TableCell>
              <TableCell>Price/Unit</TableCell>
              <TableCell>Staff Only</TableCell>
              <TableCell>Available on Storefront</TableCell>
              <TableCell>Actions</TableCell>
            </TableHead>
            {lowItems.map((item: InventoryItem) => (
              <AdminInventoryRow
                item={item}
                key={item.id}
                onClick={() => setModalItemId(item.id + "")}
                allTags={inventoryTagsResult.data?.inventoryTags ?? []}              />
            ))}
          </Table>
        </Box>

        <PageSectionHeader>All Materials</PageSectionHeader>

        <Stack direction="row" alignItems="center" spacing={1}>
          <SearchBar
            placeholder="Search inventory"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClear={() => setSearchText("")}
          />
          <Button
            variant="outlined"
            startIcon={<CreateIcon />}
            onClick={() => setModalItemId("new")}
            sx={{ height: 40 }}
          >
            New material
          </Button>
        </Stack>

        <Box sx={{width: "100%", overflowX: "scroll"}}>
          <Table>
            <TableHead>
              <TableCell>Item</TableCell>
              <TableCell>Units Available</TableCell>
              <TableCell>Price/Unit</TableCell>
              <TableCell>Staff Only</TableCell>
              <TableCell>Available on Storefront</TableCell>
              <TableCell>Actions</TableCell>
            </TableHead>
            {matchingItems.map((item: InventoryItem) => (
              <AdminInventoryRow
                item={item}
                key={item.id}
                onClick={() => setModalItemId(item.id + "")}
                allTags={inventoryTagsResult.data?.inventoryTags ?? []}
              />
            ))}
          </Table>
        </Box>

        <Ledger></Ledger>

        <MaterialModal
          itemId={modalItemId}
          onClose={() => setModalItemId("")}
        />

        <InventoryTagsModal tagModalOpen={tagsModalOpen} setTagModalOpen={setTagsModalOpen} />
      </AdminPage>
    </RequestWrapper>
  );
}
