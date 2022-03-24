import React from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { Stack } from "@mui/material";
import UserCard from "./UserCard";
import { useQuery } from "@apollo/client";
import GET_USERS, { PartialUser } from "../../../queries/getUsers";
import RequestWrapper from "../../../common/RequestWrapper";
import UserModal from "./UserModal";
import { useHistory, useParams } from "react-router-dom";

export default function UsersPage() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const getUsersResult = useQuery(GET_USERS);

  const handleUserModalClosed = () => {
    history.push("/admin/people");
  };

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
              onClick={() => history.push("/admin/people/" + user.id)}
            />
          ))}
        </Stack>

        <UserModal selectedUserID={id ?? ""} onClose={handleUserModalClosed} />
      </Page>
    </RequestWrapper>
  );
}
