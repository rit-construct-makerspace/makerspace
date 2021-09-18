import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Page from "../Page";
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
    <>
      <FormControlLabel
        control={<Checkbox size="small" sx={{ my: -0.5 }} />}
        label={`${label} (${count})`}
        sx={{ color: "text.secondary" }}
      />
    </>
  );
}

interface MachineCardProps {
  name: string;
  category: string;
}

function MachineCard({ name, category }: MachineCardProps) {
  const history = useHistory();

  return (
    <Grid item onClick={() => history.push("/")}>
      <Card sx={{ width: 250 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="150"
            image="https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp"
          />
          <CardContent>
            <Typography
              variant="h6"
              component="div"
              sx={{ lineHeight: 1, mb: 1 }}
            >
              {name}
            </Typography>
            <Typography color="text.secondary">{category}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

interface MakerEquipmentPageProps {}

export default function MakerEquipmentPage({}: MakerEquipmentPageProps) {
  return (
    <Page title="Equipment">
      <TextField
        id="search"
        placeholder="Search equipment"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
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
          <MachineCard name={"ROBOTEC 1325"} category={"CNC Machining"} />
          <MachineCard name={"ROBOTEC 1325"} category={"CNC Machining"} />
          <MachineCard name={"ROBOTEC 1325"} category={"CNC Machining"} />
          <MachineCard name={"ROBOTEC 1325"} category={"CNC Machining"} />
        </Grid>
      </Stack>
    </Page>
  );
}
