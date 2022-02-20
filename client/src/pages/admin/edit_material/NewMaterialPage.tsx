import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import MaterialEditor, { InventoryItemInput } from "./MaterialEditor";

const CREATE_INVENTORY_ITEM = gql`
  mutation CreateInventoryItem($item: InventoryItemInput) {
    createInventoryItem(item: $item) {
      id
    }
  }
`;

export default function NewMaterialPage() {
  const history = useHistory();

  const [itemDraft, setItemDraft] = useState<Partial<InventoryItemInput>>({});

  const [createInventoryItem, { data, loading, error }] = useMutation(
    CREATE_INVENTORY_ITEM,
    { variables: { item: itemDraft } }
  );

  // Redirect to the inventory page upon successful mutation
  useEffect(() => {
    if (data?.createInventoryItem?.id) history.push("/admin/inventory");
  }, [data]);

  return (
    <MaterialEditor
      isNewItem={true}
      itemDraft={itemDraft}
      setItemDraft={setItemDraft}
      onSave={createInventoryItem}
      loading={loading}
    />
  );
}
