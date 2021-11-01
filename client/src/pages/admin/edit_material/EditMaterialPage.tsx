import React from "react";
import Page from "../../Page";
import { Button, Stack, TextField } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import styled from "styled-components";

const StyledMaterialImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 4px;
  object-fit: cover;
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

      <Stack direction="row" spacing={2} mt={2}>
        <StyledMaterialImage
          alt="Material image"
          src="https://thediyplan.com/wp-content/uploads/2020/03/IMG_2897.jpg"
        />
        <Stack spacing={2} flexGrow={1}>
          <TextField label="Name" />
          <TextField label="Single unit" />
          <TextField label="Plural unit" />
        </Stack>
      </Stack>
    </Page>
  );
}
