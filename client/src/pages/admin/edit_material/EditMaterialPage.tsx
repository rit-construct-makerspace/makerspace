import React, { ChangeEvent, useEffect, useState } from "react";
import Page from "../../Page";
import { Button, InputAdornment, Stack, TextField } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import styled from "styled-components";
import PageSectionHeader from "../../../common/PageSectionHeader";
import HelpTooltip from "../../../common/HelpTooltip";
import { useHistory, useParams } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { gql, useMutation } from "@apollo/client";

const StyledMaterialImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 4px;
  object-fit: cover;
`;

interface InputErrors {
  name?: boolean;
  unit?: boolean;
  pluralUnit?: boolean;
  pricePerUnit?: boolean;
  count?: boolean;
}

const CREATE_INVENTORY_ITEM = gql`
  mutation CreateInventoryItem($item: InventoryItemInput) {
    addItemToInventory(item: $item) {
      id
    }
  }
`;

interface InventoryItemInput {
  image: string;
  name: string;
  labels: string[];
  unit: string;
  pluralUnit: string;
  count: number;
  pricePerUnit: number;
}

export default function EditMaterialPage() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const [itemDraft, setItemDraft] = useState<Partial<InventoryItemInput>>({});

  const [inputErrors, setInputErrors] = useState<InputErrors>({});

  const [createInventoryItem, { data, loading, error }] = useMutation(
    CREATE_INVENTORY_ITEM,
    { variables: { item: itemDraft } }
  );

  // Redirect to the inventory page upon successful mutation
  useEffect(() => {
    if (data?.addItemToInventory?.id) history.push("/admin/inventory");
  }, [data]);

  const isNewItem = id.toLocaleLowerCase() === "new";

  const handleStringChange =
    (property: keyof InventoryItemInput) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setItemDraft({ ...itemDraft, [property]: e.target.value });

  const handleIntChange =
    (property: keyof InventoryItemInput) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) {
        setItemDraft({ ...itemDraft, [property]: undefined });
        return;
      }
      const parsed = parseInt(e.target.value);
      setItemDraft({ ...itemDraft, [property]: Math.max(parsed, 0) });
    };

  const handleMoneyChange =
    (property: keyof InventoryItemInput) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) {
        setItemDraft({ ...itemDraft, [property]: undefined });
        return;
      }
      const parsed = parseFloat(e.target.value);
      const positive = Math.max(parsed, 0);
      const rounded = Math.round(positive * 100) / 100;
      setItemDraft({ ...itemDraft, [property]: rounded });
    };

  const handleSaveClick = async () => {
    const updatedInputErrors: InputErrors = {
      name: !itemDraft.name,
      unit: !itemDraft.unit,
      pluralUnit: !itemDraft.pluralUnit,
      pricePerUnit: itemDraft.pricePerUnit === undefined,
      count: itemDraft.count === undefined,
    };

    setInputErrors(updatedInputErrors);

    const hasInputErrors = Object.values(updatedInputErrors).some((e) => e);
    if (hasInputErrors) return;

    await createInventoryItem();
  };

  return (
    <Page title={`${isNewItem ? "New" : "Edit"} Material`} maxWidth="800px">
      {!isNewItem && (
        <Stack direction="row" spacing={1} sx={{ mt: -2, mb: 4 }}>
          <Button variant="outlined" startIcon={<HistoryIcon />}>
            View Logs
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            color="error"
          >
            Delete
          </Button>
        </Stack>
      )}

      <PageSectionHeader top>Basic Information</PageSectionHeader>

      <Stack direction="row" spacing={2} mt={2}>
        <StyledMaterialImage
          alt="Material image"
          src="https://thediyplan.com/wp-content/uploads/2020/03/IMG_2897.jpg"
        />
        <Stack spacing={2} flexGrow={1}>
          <TextField
            label="Name"
            value={itemDraft.name ?? ""}
            error={inputErrors.name}
            onChange={handleStringChange("name")}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Single unit"
              value={itemDraft.unit ?? ""}
              error={inputErrors.unit}
              onChange={handleStringChange("unit")}
            />
            <TextField
              label="Plural unit"
              value={itemDraft.pluralUnit ?? ""}
              error={inputErrors.pluralUnit}
              onChange={handleStringChange("pluralUnit")}
            />
            <TextField
              label="Price per unit"
              type="number"
              value={itemDraft.pricePerUnit ?? ""}
              error={inputErrors.pricePerUnit}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              onChange={handleMoneyChange("pricePerUnit")}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Count"
              sx={{ flex: 1 }}
              type="number"
              value={itemDraft.count ?? ""}
              error={inputErrors.count}
              onChange={handleIntChange("count")}
            />
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ flex: 1 }}
            >
              <TextField label="Threshold" type="number" sx={{ flex: 1 }} />
              <HelpTooltip
                title={
                  'If the count falls below this number, this item will appear in the "Running Low" section on the inventory page. Leave at 0 for no threshold.'
                }
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <LoadingButton
        loading={loading}
        size="large"
        variant="contained"
        startIcon={<SaveIcon />}
        sx={{ mt: 4, alignSelf: "flex-end" }}
        onClick={handleSaveClick}
      >
        Save
      </LoadingButton>
    </Page>
  );
}
