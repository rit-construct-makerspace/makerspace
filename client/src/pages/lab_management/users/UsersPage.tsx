import React, { useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { Stack } from "@mui/material";
import UserCard from "./UserCard";
import { useQuery } from "@apollo/client";
import GET_USERS, { PartialUser } from "../../../queries/userQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import UserModal from "./UserModal";
import { useNavigate, useParams } from "react-router-dom";

export default function UsersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getUsersResult = useQuery(GET_USERS);

  const handleUserModalClosed = () => {
    navigate("/admin/people");
  };

  const [searchText, setSearchText] = useState("");

  return (
    <RequestWrapper
      loading={getUsersResult.loading}
      error={getUsersResult.error}
    >
      <Page title="People" maxWidth="1250px">
        <SearchBar 
          placeholder="Search people" sx={{ mb: 2, maxWidth: 300 }} 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Stack direction="row" flexWrap="wrap">
          {getUsersResult.data?.users
            ?.filter((m: { id: number; firstName: string; lastName: string }) =>
              (m.firstName + " " + m.lastName)
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            ).map((user: PartialUser) => (
            <UserCard
              user={user}
              key={user.id}
              onClick={() => navigate("/admin/people/" + user.id)}
            />
          ))}
        </Stack>

        <UserModal selectedUserID={id ?? ""} onClose={handleUserModalClosed} />
      </Page>
    </RequestWrapper>
  );
}
