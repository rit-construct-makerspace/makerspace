import React from "react";
import Page from "../../Page";
import { Button, Divider, Stack, Typography } from "@mui/material";
import Inventory from "../../../test_data/Inventory";
import InventoryRow from "../../../common/InventoryRow";
import { useHistory } from "react-router-dom";

interface InventoryPageProps {}

export default function InventoryPage({}: InventoryPageProps) {
  const history = useHistory();

  return (
    <Page title="Inventory">
      <Button variant="outlined">💪 Bulk add</Button>
      <Typography variant="h5" component="div" sx={{ mb: 2, mt: 6 }}>
        Low Materials
      </Typography>
      <Typography variant="h5" component="div" sx={{ mb: 2, mt: 6 }}>
        All Materials
      </Typography>
      <Stack divider={<Divider flexItem />}>
        {Inventory.map((item) => (
          <InventoryRow
            item={item}
            key={item.id}
            onClick={() => history.push(`/admin/inventory/${item.id}`)}
          />
        ))}
      </Stack>
    </Page>
  );
}
