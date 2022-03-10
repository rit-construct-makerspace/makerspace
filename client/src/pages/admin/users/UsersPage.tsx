import React from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { Stack } from "@mui/material";
import UserCard from "./UserCard";
import { useQuery } from "@apollo/client";
import GET_USERS, { PartialUser } from "../../../queries/getUsers";
import RequestWrapper from "../../../common/RequestWrapper";

export default function UsersPage() {
  const getUsersResult = useQuery(GET_USERS);

  return (
    <RequestWrapper
      loading={getUsersResult.loading}
      error={getUsersResult.error}
    >
      <Page title="People">
        <SearchBar placeholder="Search people" sx={{ mb: 2, maxWidth: 300 }} />
        <Stack direction="row" flexWrap="wrap">
          {getUsersResult.data?.users.map((u: PartialUser) => (
            <UserCard user={u} key={u.id} />
          ))}
        </Stack>
      </Page>
    </RequestWrapper>
  );
}
