import React from "react";
import Page from "../../Page";
import {
  Autocomplete,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HistoryIcon from "@mui/icons-material/History";

const StyledMachineImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 4px;
`;

export default function EditEquipmentPage() {
  return (
    <Page title="Manage equipment">
      <Stack direction="row" spacing={1} sx={{ mt: -2, mb: 4 }}>
        <Button variant="outlined" startIcon={<EngineeringIcon />}>
          Schedule Maintenance
        </Button>
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

      <Typography variant="h5" component="div">
        Basic information
      </Typography>

      <Stack direction="row" spacing={2} mt={2}>
        <StyledMachineImage
          alt="Machine image"
          src="https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp"
        />
        <Stack spacing={2} flexGrow={1}>
          <TextField label="Name" />
          <TextField label="Descriptor" />
          <Autocomplete
            renderInput={(params) => <TextField {...params} label="Location" />}
            options={[
              "Machining room",
              "Sewing room",
              "Wood shop",
              "Malachowsky's office",
            ]}
          />
        </Stack>
      </Stack>
      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" component="div">
        Categories
      </Typography>

      <Stack direction="row" flexWrap="wrap" spacing={2}>
        <FormControlLabel control={<Checkbox />} label="Sanding" />
        <FormControlLabel control={<Checkbox />} label="3D Printing" />
        <FormControlLabel control={<Checkbox />} label="Metalworking" />
        <FormControlLabel control={<Checkbox />} label="Woodworking" />
        <FormControlLabel control={<Checkbox />} label="CNC Machining" />
        <FormControlLabel control={<Checkbox />} label="Electronics" />
        <FormControlLabel control={<Checkbox />} label="Sewing" />
        <FormControlLabel control={<Checkbox />} label="Metalworking" />
        <FormControlLabel control={<Checkbox />} label="CNC Machining" />
      </Stack>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" component="div">
        Training Modules
      </Typography>
      <p>
        Imagine a list of required training modules here, with the ability to
        add and remove required modules
      </p>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" component="div">
        Makers
      </Typography>
      <p>
        Image a list of makers who have fulfilled the training modules and thus
        have access to this equipment, with the ability to add or remove makers
      </p>
    </Page>
  );
}
