import React from "react";
import Page from "../../Page";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import styled from "styled-components";
import PageSectionHeader from "../../../common/PageSectionHeader";
import HelpTooltip from "../../../common/HelpTooltip";
import ItemCategories from "../../../test_data/ItemCategories";

const StyledMaterialImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 4px;
  object-fit: cover;
`;

const StyledColumns = styled.div`
  columns: 200px auto;
  margin-left: 2px;
`;

interface EditMaterialPageProps {}

export default function EditMaterialPage({}: EditMaterialPageProps) {
  return (
    <Page title="Edit Material">
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

      <PageSectionHeader top>Basic Information</PageSectionHeader>

      <Stack direction="row" spacing={2} mt={2}>
        <StyledMaterialImage
          alt="Material image"
          src="https://thediyplan.com/wp-content/uploads/2020/03/IMG_2897.jpg"
        />
        <Stack spacing={2} flexGrow={1} maxWidth={800}>
          <TextField label="Name" />
          <Stack direction="row" spacing={2}>
            <TextField label="Single unit" sx={{ flex: 1 }} />
            <TextField label="Plural unit" sx={{ flex: 1 }} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField label="Count" sx={{ flex: 1 }} />
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

      <PageSectionHeader>Categories</PageSectionHeader>

      <StyledColumns>
        {ItemCategories.sort().map((cat) => (
          <div>
            <FormControlLabel
              key={cat}
              control={<Checkbox size="small" />}
              label={cat}
            />
          </div>
        ))}
      </StyledColumns>

      <Button
        size="small"
        startIcon={<SettingsIcon />}
        sx={{ mt: 1, ml: -0.25 }}
      >
        Manage categories
      </Button>
    </Page>
  );
}
