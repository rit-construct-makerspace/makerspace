import { useState } from "react";
import Page from "../../Page";
import {
  Alert,
  CircularProgress,
  Collapse,
  Stack,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import PageSectionHeader from "../../../common/PageSectionHeader";
import CardReader from "./CardReader";
import SwipedUserCard from "./SwipedUserCard";
import { GET_ROOM } from "../../../queries/getRooms";
import { StyledRecentSwipes } from "./MonitorRoomPage";

export interface Swipe {
  id: string;
  dateTime: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function SwipePage() {
  const { id } = useParams<{ id: string }>();
  const queryResult = useQuery(GET_ROOM, { variables: { id } });
  const [loadingUser, setLoadingUser] = useState(false);
  const [cardErrorCount, setCardErrorCount] = useState(0);

  return (
    <RequestWrapper2
      result={queryResult}
      render={({ room }) => (
        <Page title={room.name} maxWidth="1200px">
          <Collapse in={cardErrorCount > 0}>
            <Alert
              severity="error"
              onClose={() => setCardErrorCount(0)}
              sx={{ mb: 2 }}
            >
              <b>Unrecognized card{cardErrorCount > 1 ? " (" + cardErrorCount + ")" : null}.</b> Has this person registered with The
              Construct? Have they entered their university ID correctly?
            </Alert>
          </Collapse>

          <Stack direction="row" alignItems="flex-start" spacing={2}>
            <PageSectionHeader top>Recent Swipes</PageSectionHeader>
            {loadingUser && (
              <CircularProgress size={20} sx={{ mt: "4px !important" }} />
            )}
            <CardReader
              setLoadingUser={setLoadingUser}
              onCardError={() => setCardErrorCount(cardErrorCount + 1)}
            />
          </Stack>

          <StyledRecentSwipes>
            {room.recentSwipes.map((s: Swipe) => (
              <SwipedUserCard key={s.id} swipe={s} />
            ))}
          </StyledRecentSwipes>
        </Page>
      )}
    />
  );
}
