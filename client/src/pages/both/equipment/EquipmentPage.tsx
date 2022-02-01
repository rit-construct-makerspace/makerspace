import React from "react";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
} from "@mui/material";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import MachineCard from "./MachineCard";
import { useHistory } from "react-router-dom";

const Categories = [
  {
    label: "Wood",
    count: 15,
  },
  {
    label: "CNC Machining",
    count: 11,
  },
  {
    label: "Post Processing",
    count: 11,
  },
  {
    label: "Pre Processing",
    count: 9,
  },
  {
    label: "Plastics",
    count: 8,
  },
];

interface FilterCheckboxProps {
  label: string;
  count: number;
}

function FilterCheckbox({ label, count }: FilterCheckboxProps) {
  return (
    <FormControlLabel
      control={<Checkbox size="small" sx={{ my: -0.5 }} />}
      label={`${label} (${count})`}
      sx={{ color: "text.secondary" }}
    />
  );
}

interface MakerEquipmentPageProps {
  isAdmin: boolean;
}

export default function EquipmentPage({ isAdmin }: MakerEquipmentPageProps) {
  const history = useHistory();

  const machineCardLink = isAdmin
    ? "/admin/edit-equipment"
    : "/create-reservation";

  return (
    <Page title="Equipment">
      <Stack direction="row" spacing={2}>
        <SearchBar placeholder="Search equipment" />
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => history.push("/admin/edit-equipment")}
          >
            + Add Equipment
          </Button>
        )}
      </Stack>

      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        paddingTop={2}
      >
        <FormGroup sx={{ flexShrink: 0 }}>
          {Categories.map((category) => (
            <FilterCheckbox label={category.label} count={category.count} />
          ))}
        </FormGroup>

        <Grid container paddingX={2} spacing={2}>
          <MachineCard
            name={"ROBOTEC 1325"}
            category={"CNC Machining"}
            to={machineCardLink}
          />
          <MachineCard
            name={"ROBOTEC 1325"}
            category={"CNC Machining"}
            to={machineCardLink}
          />
          <MachineCard
            name={"ROBOTEC 1325"}
            category={"CNC Machining"}
            to={machineCardLink}
          />
          <MachineCard
            name={"ROBOTEC 1325"}
            category={"CNC Machining"}
            to={machineCardLink}
          />
        </Grid>
      </Stack>
    </Page>
  );
}
