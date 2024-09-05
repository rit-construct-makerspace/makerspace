import React from "react";
import Page from "../../Page";
import { Box, Card, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import { gql, OperationVariables, QueryResult } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";

interface CountCardProps {
  count: string | null;
  query: QueryResult<any, OperationVariables> | null;
  label: string | null;
  unit: string | null;
}

export default function CountCard({count = null, query = null, label, unit}: CountCardProps) {
  return (
    <Card sx={{maxWidth: "15em", m: ".5em"}}>
      {label &&
      <CardHeader title={label} sx={{minHeight: "5em", overflowY: "clip", textAlign: "center"}}></CardHeader>}
      <CardContent>
          {query
          ? <RequestWrapper loading={query.loading} error={query.error}><Typography variant="h2" align="center" fontWeight={"bold"}>{query.data?.dailySiteVisits.value.toLocaleString()}</Typography></RequestWrapper>
          : <Typography variant="h2" align="center" fontWeight={"bold"}>{count}</Typography>}
          {unit &&
          <Typography variant="body2" align="center">{unit}</Typography>}
      </CardContent>
    </Card>
  );
}
