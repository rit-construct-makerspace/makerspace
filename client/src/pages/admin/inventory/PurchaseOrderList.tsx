import React from "react";
import { Button, Divider, Stack } from "@mui/material";
import PageSectionHeader from "../../../common/PageSectionHeader";
import TestData from "../../../test_data/PurchaseOrders";
import PurchaseOrder from "./PurchaseOrder";
import CreateIcon from "@mui/icons-material/Create";
import { useHistory } from "react-router-dom";

export default function PurchaseOrderList() {
  const history = useHistory();

  return (
    <Stack>
      <PageSectionHeader top>Purchase Orders</PageSectionHeader>

      {/*<EmptyPageSection*/}
      {/*  icon={<LocalShippingIcon />}*/}
      {/*  label="No pending orders."*/}
      {/*/>*/}

      <Stack divider={<Divider flexItem />}>
        {TestData.map((order) => (
          <PurchaseOrder order={order} key={order.id} />
        ))}
      </Stack>

      <Button
        startIcon={<CreateIcon />}
        sx={{ mt: 2, alignSelf: "center" }}
        onClick={() => history.push("/admin/create-purchase-order")}
      >
        Create order
      </Button>
    </Stack>
  );
}
