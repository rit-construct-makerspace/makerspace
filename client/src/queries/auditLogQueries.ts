import {gql} from "@apollo/client";

export const GET_LOGS = gql`
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