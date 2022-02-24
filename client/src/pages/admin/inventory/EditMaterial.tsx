import React, { useEffect, useState } from "react";
import MaterialModalContents, {
  InventoryItemInput,
} from "./MaterialModalContents";
import { gql, useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import GET_INVENTORY_ITEMS from "../../../queries/getInventoryItems";

const GET_INVENTORY_ITEM = gql`
  query GetInventoryItem($id: ID!) {
    InventoryItem(Id: $id) {
      name
      unit
      pluralUnit
      pricePerUnit
      count
      threshold
    }
  }
`;

const UPDATE_INVENTORY_ITEM = gql`
  mutation UpdateInventoryItem($id: ID!, $item: InventoryItemInput) {
    updateInventoryItem(itemId: $id, item: $item) {
      id
    }
  }
`;

interface EditMaterialProps {
  itemId: string;
  onClose: () => void;
}

export default function EditMaterial({ itemId, onClose }: EditMaterialProps) {
  const [itemDraft, setItemDraft] = useState<Partial<InventoryItemInput>>({});

  const query = useQuery(GET_INVENTORY_ITEM, {
    variables: { id: itemId },
  });

  const [updateInventoryItem, mutation] = useMutation(UPDATE_INVENTORY_ITEM, {
    variables: { id: itemId, item: itemDraft },
    refetchQueries: [
      { query: GET_INVENTORY_ITEMS },
      { query: GET_INVENTORY_ITEM, variables: { id: itemId } },
    ],
  });

  // After the item has been fetched, fill in the draft
  useEffect(() => {
    if (!query.data?.InventoryItem) return;
    setItemDraft({
      ...query.data.InventoryItem,
      __typename: undefined,
    });
  }, [query.data, setItemDraft]);

  // Close the modal upon successful mutation
  useEffect(() => {
    if (mutation.data?.updateInventoryItem?.id) onClose();
  }, [mutation.data, onClose]);

  return (
    <RequestWrapper loading={query.loading} error={query.error} minHeight={322}>
      <MaterialModalContents
        isNewItem={false}
        itemDraft={itemDraft}
        setItemDraft={setItemDraft}
        onSave={updateInventoryItem}
        loading={mutation.loading}
      />
    </RequestWrapper>
  );
}
