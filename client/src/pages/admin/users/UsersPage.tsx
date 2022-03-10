import React, { useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { Stack } from "@mui/material";
import UserCard from "./UserCard";
import { useQuery } from "@apollo/client";
import GET_USERS, { PartialUser } from "../../../queries/getUsers";
import RequestWrapper from "../../../common/RequestWrapper";
import UserModal from "./UserModal";

export default function UsersPage() {
  const getUsersResult = useQuery(GET_USERS);
  const [selectedUserID, setSelectedUserID] = useState<string>("");

  return (
    <RequestWrapper
      loading={getUsersResult.loading}
      error={getUsersResult.error}
    >
      <Page title="People">
        <SearchBar placeholder="Search people" sx={{ mb: 2, maxWidth: 300 }} />
        <Stack direction="row" flexWrap="wrap">
          {getUsersResult.data?.users.map((user: PartialUser) => (
            <UserCard
              user={user}
              key={user.id}
              onClick={() => setSelectedUserID(user.id)}
            />
          ))}
        </Stack>

        <UserModal
          selectedUserID={selectedUserID}
          onClose={() => setSelectedUserID("")}
        />
      </Page>
    </RequestWrapper>
  );
}
