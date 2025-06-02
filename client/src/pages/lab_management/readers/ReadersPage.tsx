import { useQuery } from "@apollo/client";
import { GET_READERS, Reader } from "../../../queries/readersQueries";
import { Button, Grid, Stack } from "@mui/material";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { useNavigate } from "react-router-dom";
import RequestWrapper from "../../../common/RequestWrapper";
import { useState } from "react";
import ReaderCard from "./ReaderCard";
import AdminPage from "../../AdminPage";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import AddIcon from '@mui/icons-material/Add';


export default function ReadersPage() {
  const getReadersResult = useQuery(GET_READERS, {pollInterval: 2000});

  const url = "/admin/readers";
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");

  return (
    <AdminPage title="Readers" maxWidth="1250px">
      <Stack direction="row" spacing={2}>
        <SearchBar
          placeholder="Search access devices"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {
          user.privilege === "STAFF" ? 
          <Button color="success" variant="contained" onClick={()=>{navigate("/admin/newreader")}}><AddIcon/>Pair New Reader</Button> 
          : null
        }
      </Stack>

      <RequestWrapper
        loading={getReadersResult.loading}
        error={getReadersResult.error}
      >
        <Grid container spacing={3} mt={2}>
          {getReadersResult.data?.readers?.filter((m: Reader) =>
            m.name
              .toLocaleLowerCase()
              .includes(searchText.toLocaleLowerCase())
          ).map((e: Reader) => (
            <Grid key={e.id}>
              <ReaderCard id={e.id} name={e.name} machineID={parseInt(e.machineID)} machineType={e.machineType} 
                zone={e.zone} temp={e.temp} state={e.state} userID={e.user?.id} userName={e.user != null ? e.user.firstName + " " + e.user.lastName : null}
                recentSessionLength={e.recentSessionLength} lastStatusReason={e.lastStatusReason} 
                scheduledStatusFreq={e.scheduledStatusFreq} lastStatusTime={e.lastStatusTime} helpRequested={e.helpRequested}
                BEVer={e.BEVer} FEVer={e.FEVer} HWVer={e.HWVer} SN={e.SN}/>
            </Grid>
          ))}
        </Grid>
      </RequestWrapper>
    </AdminPage>
  );
}