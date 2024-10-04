import React, { useEffect, useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { Button, Stack } from "@mui/material";
import UserCard from "./UserCard";
import { useLazyQuery, useQuery } from "@apollo/client";
import GET_USERS, { GET_NUM_USERS, PartialUser } from "../../../queries/getUsers";
import RequestWrapper from "../../../common/RequestWrapper";
import UserModal from "./UserModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdminPage from "../../AdminPage";
import User from "../../../types/User";

export default function UsersPage() {
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [query, queryResult] = useLazyQuery(GET_USERS);
  const numUsersResult = useQuery(GET_NUM_USERS);

  const [searchText, setSearchText] = useState("");

  const safeData = queryResult.data?.Ledgers ?? [];

  const setUrlParam = (paramName: string, paramValue: string) => {
    const params = new URLSearchParams(search);
    params.set(paramName, paramValue);
    navigate("/admin/people?" + params, { replace: true });
  };
  

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const queryString = searchParams.get("q") ?? "";

    setSearchText(queryString);

    query({
      variables: {
        searchText: queryString,
      },
    });
  }, [search, query]);


  const handleUserModalClosed = () => {
    navigate("/admin/people");
  };

  return (
    <RequestWrapper
      loading={queryResult.loading}
      error={queryResult.error}
    >
      <AdminPage title="People" maxWidth="1250px">
        <Stack direction={"row"} spacing={1} sx={{mb: 2}}>
          <SearchBar 
            placeholder={"Search " + numUsersResult.data?.numUsers.count + " users"}
            sx={{ maxWidth: 300 }} 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClear={() => setSearchText("")}
            onSubmit={() => setUrlParam("q", searchText)}
          />
          <Button onClick={(e) => setUrlParam("q", searchText)} variant="contained" color="primary">Search</Button>
        </Stack>
        <Stack direction="row" flexWrap="wrap">
          {queryResult.data?.users
            // .filter((m: { id: number; ritUsername: String; firstName: string; lastName: string }) =>
            //   (m.firstName + " " + m.lastName + " " + m.ritUsername)
            //     .toLocaleLowerCase()
            //     .includes(searchText.toLocaleLowerCase())
            // )
            ?.map((user: PartialUser) => (
            <UserCard
              user={user}
              key={user.id}
              onClick={() => navigate("/admin/people/" + user.id)}
            />
          ))}
        </Stack>
        <p>This page is limited to 100 users. Consider narrowing your search.</p>

        <UserModal selectedUserID={id ?? ""} onClose={handleUserModalClosed} />
      </AdminPage>
    </RequestWrapper>
  );
}
