import React, { ChangeEvent } from "react";
import Page from "../../Page";
import PurchaseOrderExplainer from "./PurchaseOrderExplainer";
import {
  Autocomplete,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useImmer } from "use-immer";
import InventoryItem from "../../../types/InventoryItem";
import Inventory from "../../../test_data/Inventory";
import InvItemNamePic from "../../../common/InvItemNamePic";
import CloseButton from "../../../common/CloseButton";
import ImageIcon from "@mui/icons-material/Image";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Criterion from "./Criterion";

function getAvailableItemNames(
  inventory: InventoryItem[],
  purchaseOrderItems: InventoryItem[]
): string[] {
  const inventoryNames = inventory.map((i) => i.name);
  const purchaseOrderItemNames = purchaseOrderItems.map((i) => i.name);
  return inventoryNames.filter((n) => !purchaseOrderItemNames.includes(n));
}

interface NewPurchaseOrder {
  expectedDelivery: string;
  items: InventoryItem[];
}

interface CreatePurchaseOrderPageProps {}

export default function CreatePurchaseOrderPage({}: CreatePurchaseOrderPageProps) {
  const [purchaseOrder, setPurchaseOrder] = useImmer<NewPurchaseOrder>({
    expectedDelivery: "",
    items: [],
  });

  const atLeastOneItem = purchaseOrder.items.length > 0;
  const allItemsAtLeastOne =
    atLeastOneItem && purchaseOrder.items.every((i) => i.count > 0);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPurchaseOrder((draft) => {
      draft.expectedDelivery = e.target.value;
    });
  };

  const addItem = (itemName: string | null) => {
    const item = Inventory.find((i) => i.name === itemName);

    if (!item) {
      console.error(`Tried to add item with unknown name ${itemName}`);
      return;
    }

    setPurchaseOrder((draft) => {
      draft.items.push({
        ...item,
        count: 0,
      });
    });
  };

  const removeItem = (itemId: number) => {
    setPurchaseOrder((draft) => {
      const index = draft.items.findIndex((i) => i.id === itemId);
      draft.items.splice(index, 1);
    });
  };

  const setItemCount = (itemId: number, count: string) => {
    setPurchaseOrder((draft) => {
      const item = draft.items.find((i) => i.id === itemId);
      const countNum = parseInt(count);

      if (!item || isNaN(countNum) || countNum < 0) return;

      item.count = countNum;
    });
  };

  return (
    <Page title="New Purchase Order">
      <PurchaseOrderExplainer />

      <Typography variant="h6" component="div" mb={1}>
        Items
      </Typography>

      <Stack
        divider={<Divider flexItem />}
        spacing={1}
        sx={{
          width: "100%",
          maxWidth: 500,
          mb: purchaseOrder.items.length > 0 ? 2 : 1,
        }}
      >
        {purchaseOrder.items.map((item) => (
          <Stack direction="row" alignItems="center" spacing={2} key={item.id}>
            <InvItemNamePic item={item} />
            <TextField
              label="Count"
              type="number"
              size="small"
              sx={{ width: 80 }}
              value={item.count}
              onChange={(e) => setItemCount(item.id, e.target.value)}
            />
            <CloseButton onClick={() => removeItem(item.id)} />
          </Stack>
        ))}
      </Stack>

      <Autocomplete
        key={purchaseOrder.items.length} // this resets the autocomplete component when an item is selected
        renderInput={(params) => <TextField {...params} label={"Add item"} />}
        options={getAvailableItemNames(Inventory, purchaseOrder.items)}
        sx={{ width: 300 }}
        onChange={(e, v) => {
          addItem(v);
        }}
      />

      <Typography variant="h6" component="div" sx={{ mt: 6, mb: 1 }}>
        Attachments
      </Typography>

      <Stack direction="row">
        <Button
          variant="outlined"
          sx={{ width: 100, height: 100, lineHeight: 1.25 }}
        >
          <Stack alignItems="center">
            <ImageIcon sx={{ mb: 1 }} />
            <div>Attach</div>
            <div>image</div>
          </Stack>
        </Button>
      </Stack>

      <TextField
        label="Expected delivery"
        type="date"
        InputLabelProps={{ shrink: true }} // https://github.com/mui-org/material-ui/issues/8131#issuecomment-328373902
        onChange={handleDateChange}
        value={purchaseOrder.expectedDelivery}
        sx={{ mt: 8 }}
      />

      <Button
        variant="contained"
        size="large"
        sx={{ display: "flex", mt: 8 }}
        startIcon={<LocalShippingIcon />}
        disabled={
          !atLeastOneItem ||
          !allItemsAtLeastOne ||
          !purchaseOrder.expectedDelivery
        }
      >
        Create purchase order
      </Button>

      <Stack spacing={0.25} sx={{ mt: 2, ml: 2 }}>
        <Criterion satisfied={atLeastOneItem} label={"At least one item"} />
        <Criterion
          satisfied={allItemsAtLeastOne}
          label={"All items have count of at least one"}
        />
        <Criterion
          satisfied={!!purchaseOrder.expectedDelivery}
          label={"Expected delivery date provided"}
        />
      </Stack>
    </Page>
  );
}
