import React from "react";
import { Divider, Stack } from "@mui/material";
import PageSectionHeader from "../../../common/PageSectionHeader";
import Inventory from "../../../test_data/Inventory";
import InventoryRow from "../../../common/InventoryRow";
import { useHistory } from "react-router-dom";

export default function RunningLow() {
  const history = useHistory();

  return (
    <Stack>
      <PageSectionHeader top>Running Low</PageSectionHeader>

      <Stack divider={<Divider flexItem />}>
        {Inventory.slice(1, 3).map((item) => (
          <InventoryRow
            item={item}
            key={item.id}
            onClick={() => history.push(`/admin/inventory/${item.id}`)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
