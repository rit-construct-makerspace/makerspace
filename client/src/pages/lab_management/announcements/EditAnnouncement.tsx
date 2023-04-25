import React, { useEffect, useState } from "react";
import AnnouncementModalContents, {
  AnnouncementInput,
} from "./AnnouncementModalContents";
import { gql, useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import { GET_ANNOUNCEMENTS } from "../../../queries/getAnnouncements";

const GET_ANNOUNCEMENT = gql`
  query GetAnnouncementByID($id: ID!) {
    Announcement(Id: $id) {
      title
      description
    }
  }
`;

const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: ID!, $announcement: Announcement) {
    updateAnnouncement(announcementID: $id, announcement: $announcement) {
      id
    }
  }
`;

interface EditAnnouncementProps {
  announcementID: string;
  onClose: () => void;
}

export default function EditAnnouncement({ announcementID, onClose }: EditAnnouncementProps) {
  const [announcementDraft, setAnnouncementDraft] = useState<Partial<AnnouncementInput>>({});

  const query = useQuery(GET_ANNOUNCEMENT, {
    variables: { id: announcementID },
  });

  const [updateInventoryItem, mutation] = useMutation(UPDATE_ANNOUNCEMENT, {
    variables: { id: announcementID, item: announcementDraft },
    refetchQueries: [
      { query: GET_ANNOUNCEMENTS },
      { query: GET_ANNOUNCEMENT, variables: { id: announcementID } },
    ],
  });

  // After the item has been fetched, fill in the draft
  useEffect(() => {
    if (!query.data?.InventoryItem) return;
    setAnnouncementDraft({
      ...query.data.InventoryItem,
      __typename: undefined,
    });
  }, [query.data, setAnnouncementDraft]);

  // Close the modal upon successful mutation
  useEffect(() => {
    if (mutation.data?.updateInventoryItem?.id) onClose();
  }, [mutation.data, onClose]);

  return (
    <RequestWrapper loading={query.loading} error={query.error} minHeight={322}>
      <AnnouncementModalContents
        isNewAnnouncement={false}
        announcementDraft={announcementDraft}
        setAnnouncementDraft={setAnnouncementDraft}
        onSave={updateInventoryItem}
        loading={mutation.loading}
      />
    </RequestWrapper>
  );
}
