import { Grid, Stack } from "@mui/material";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import EquipmentCard from "./EquipmentCard";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_EQUIPMENTS } from "../../../queries/equipmentQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import EquipmentModal from "../../maker/equipment_modal/EquipmentModal";
import { ObjectSummary } from "../../../types/Common";
import { useState } from "react";

export default function EquipmentPage() {
  const { id } = useParams<{ id: string }>();

  const getEquipmentsResult = useQuery(GET_EQUIPMENTS);

  const url = "/maker/equipment/";
  const [searchText, setSearchText] = useState("");

  return (
    <Page title="Equipment" maxWidth="1250px">
    <Stack direction="row" spacing={2}>
        <SearchBar 
          placeholder="Search equipment"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} 
        />
    </Stack>

    <RequestWrapper
      loading={getEquipmentsResult.loading}
      error={getEquipmentsResult.error}
    >
        <Grid container spacing={3} mt={2}>
          {getEquipmentsResult.data?.equipments?.filter((m: ObjectSummary) =>
              m.name
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            ).map((e: ObjectSummary) => (
              <Grid key={e.id} item sx={{width: {xs: '100%', sm: '295px'}}}>
                <EquipmentCard id={e.id} name={e.name} to={url + e.id} pictureURL={e.pictureURL}/>
              </Grid>
          ))}
        </Grid>
    </RequestWrapper>

    { id && <EquipmentModal equipmentID={id} />}
  </Page>
  );
}
