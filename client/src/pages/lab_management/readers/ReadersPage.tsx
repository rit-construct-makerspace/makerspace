import { useQuery } from "@apollo/client";
import { GET_READERS, Reader } from "../../../queries/readersQueries";
import { Grid, Stack } from "@mui/material";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { useParams } from "react-router-dom";
import RequestWrapper from "../../../common/RequestWrapper";
import { ObjectSummary } from "../../../types/Common";
import { useState } from "react";
import ReaderCard from "./ReaderCard";


export default function ReadersPage() {
  const getReadersResult = useQuery(GET_READERS, {pollInterval: 2000});

  const url = "/admin/readers";

  const [searchText, setSearchText] = useState("");

  return (
    <Page title="Readers" maxWidth="1250px">
      <Stack direction="row" spacing={2}>
        <SearchBar
          placeholder="Search access devices"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
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
            <Grid key={e.id} item>
              <ReaderCard id={e.id} name={e.name} machineID={parseInt(e.machineID)} machineType={e.machineType} 
                zone={e.zone} temp={e.temp} state={e.state} userID={e.user?.id} userName={e.user != null ? e.user.firstName + " " + e.user.lastName : null}
                recentSessionLength={e.recentSessionLength} lastStatusReason={e.lastStatusReason} 
                scheduledStatusFreq={e.scheduledStatusFreq} lastStatusTime={e.lastStatusTime} helpRequested={e.helpRequested} />
            </Grid>
          ))}
        </Grid>
      </RequestWrapper>
    </Page>
  );
}