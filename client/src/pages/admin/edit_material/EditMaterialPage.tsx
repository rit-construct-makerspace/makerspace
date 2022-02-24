import React, { useEffect, useState } from "react";
import MaterialEditor, { InventoryItemInput } from "./MaterialEditor";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router-dom";
import RequestWrapper from "../../../common/RequestWrapper";

const GET_INVENTORY_ITEM = gql`
  query GetInventoryItem($id: ID!) {
    InventoryItem(Id: $id) {
      name
      unit
      pluralUnit
      pricePerUnit
      count
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

export default function EditMaterialPage() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [itemDraft, setItemDraft] = useState<Partial<InventoryItemInput>>({});

  const query = useQuery(GET_INVENTORY_ITEM, {
    fetchPolicy: "no-cache",
    variables: { id },
  });

  const [updateInventoryItem, mutation] = useMutation(UPDATE_INVENTORY_ITEM, {
    variables: { id, item: itemDraft },
  });

  // After the item has been fetched, fill in the draft
  useEffect(() => {
    if (!query.data?.InventoryItem) return;
    setItemDraft({
      ...query.data.InventoryItem,
      __typename: undefined,
    });
  }, [query.data, setItemDraft]);

  // Redirect to the inventory page upon successful mutation
  useEffect(() => {
    if (mutation.data?.updateInventoryItem?.id)
      history.push("/admin/inventory");
  }, [mutation.data, history]);

  return (
    <RequestWrapper loading={query.loading} error={query.error}>
      <MaterialEditor
        isNewItem={false}
        itemDraft={itemDraft}
        setItemDraft={setItemDraft}
        onSave={updateInventoryItem}
        loading={mutation.loading}
      />
    </RequestWrapper>
  );
}
