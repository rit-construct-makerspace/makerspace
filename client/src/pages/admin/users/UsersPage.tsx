import React from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import generateUsers from "../../../test_data/Users";
import { Stack } from "@mui/material";
import UserCard from "./UserCard";

const testUsers = generateUsers(3, 9, 50);

interface UsersPageProps {}

export default function UsersPage({}: UsersPageProps) {
  return (
    <Page title="People">
      <SearchBar placeholder="Search people" sx={{ mb: 2 }} />
      <Stack direction="row" flexWrap="wrap">
        {testUsers.map((u) => (
          <UserCard user={u} key={u.id} />
        ))}
      </Stack>
    </Page>
  );
}
