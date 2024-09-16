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
import Equipment from "../../../types/Equipment";

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
          {getEquipmentsResult.data?.equipments?.filter((m: Equipment) =>
              m.name
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            ).map((e: Equipment) => (
              <Grid key={e.id} item>
                <EquipmentCard id={e.id??0} name={e.name} to={url + e.id} sopUrl={e.sopUrl} imageUrl={(e.imageUrl == undefined || e.imageUrl == null ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : "" + process.env.REACT_APP_CDN_URL + process.env.REACT_APP_CDN_EQUIPMENT_DIR + "/" + e.imageUrl)} />
              </Grid>
          ))}
        </Grid>
    </RequestWrapper>

    { id && <EquipmentModal equipmentID={id} />}
  </Page>
  );
}
