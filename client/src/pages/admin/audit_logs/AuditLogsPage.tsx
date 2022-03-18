import React from "react";
import Page from "../../Page";
import { Divider, Stack, TextField } from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import { gql, useQuery } from "@apollo/client";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import AuditLogRow from "./AuditLogRow";

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
  const queryResult = useQuery(GET_LOGS);

  return (
    <RequestWrapper2
      result={queryResult}
      render={(data) => (
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
            <SearchBar />
          </Stack>

          <Stack divider={<Divider flexItem />} mt={4} spacing={2}>
            {data.auditLogs.map((log: any) => (
              <AuditLogRow
                key={log.id}
                dateTime={log.dateTime}
                message={log.message}
              />
            ))}
          </Stack>
        </Page>
      )}
    />
  );
}
