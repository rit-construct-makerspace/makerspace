import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import MaterialModalContents, {
  InventoryItemInput,
} from "./MaterialModalContents";
import GET_INVENTORY_ITEMS from "../../../queries/getInventoryItems";

const CREATE_INVENTORY_ITEM = gql`
  mutation CreateInventoryItem($item: InventoryItemInput) {
    createInventoryItem(item: $item) {
      id
    }
  }
`;

interface NewMaterialProps {
  onClose: () => void;
}

export default function NewMaterial({ onClose }: NewMaterialProps) {
  const [itemDraft, setItemDraft] = useState<Partial<InventoryItemInput>>({});

  const [createInventoryItem, { data, loading }] = useMutation(
    CREATE_INVENTORY_ITEM,
    {
      variables: { item: itemDraft },
      refetchQueries: [{ query: GET_INVENTORY_ITEMS }],
    }
  );

  // Close the modal upon successful mutation
  useEffect(() => {
    if (data?.createInventoryItem?.id) onClose();
  }, [data, onClose]);

  return (
    <MaterialModalContents
      isNewItem={true}
      itemDraft={itemDraft}
      setItemDraft={setItemDraft}
      onSave={createInventoryItem}
      loading={loading}
    />
  );
}
