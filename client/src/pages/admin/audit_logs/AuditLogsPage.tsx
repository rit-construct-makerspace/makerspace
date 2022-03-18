import React, { useEffect, useState } from "react";
import Page from "../../Page";
import { Chip, Divider, Stack, TextField } from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import AuditLogRow from "./AuditLogRow";
import { useHistory, useLocation } from "react-router-dom";

const GET_LOGS = gql`
  query GetLogs(
    $startDate: DateTime
    $stopDate: DateTime
    $searchText: String
  ) {
    auditLogs(
      startDate: $startDate
      stopDate: $stopDate
      searchText: $searchText
    ) {
      id
      dateTime
      message
    }
  }
`;

export default function LogPage() {
  const { search } = useLocation();
  const history = useHistory();
  const [query, queryResult] = useLazyQuery(GET_LOGS);
  const [searchText, setSearchText] = useState("");

  const getUrlQuery = () => {
    const searchParams = new URLSearchParams(search);
    return searchParams.get("q") ?? "";
  };

  useEffect(() => {
    const urlQuery = getUrlQuery();
    setSearchText(urlQuery);
    query({ variables: { searchText: urlQuery } });
  }, [search]);

  const handleSearch = () => {
    const params = new URLSearchParams({ q: searchText });
    history.replace("/admin/history?" + params);
  };

  const handleClear = () => {
    setSearchText("");
    history.replace("/admin/history");
  };

  return (
    <Page title="History" maxWidth="800px">
      <Stack direction="row" spacing={2}>
        <TextField
          label="Start"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ width: 180 }}
        />
        <TextField
          label="Stop"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ width: 180 }}
        />
        <SearchBar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onClear={handleClear}
          onSubmit={handleSearch}
        />
      </Stack>
      <RequestWrapper2
        result={queryResult}
        render={(data) => (
          <Stack divider={<Divider flexItem />} mt={4} spacing={2}>
            {data.auditLogs.map((log: any) => (
              <AuditLogRow
                key={log.id}
                dateTime={log.dateTime}
                message={log.message}
              />
            ))}
          </Stack>
        )}
      />
    </Page>
  );
}
