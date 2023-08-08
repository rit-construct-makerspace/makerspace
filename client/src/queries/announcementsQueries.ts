import { gql } from "@apollo/client";

export interface Announcement {
  id: string;
  title: string;
  description: string;
}

export const GET_ANNOUNCEMENTS = gql`
  query GetAnnouncements {
    getAllAnnouncements {
      id
      title
      description
    }
  }
`;

export const CREATE_ANNOUNCEMENT = gql`
mutation CreateAnnouncement($title: String!, $description: String!) {
  createAnnouncement(title: $title, description: $description) {
    id
    title
    description
  }
}
`;

export const GET_ANNOUNCEMENT = gql`
  query GetAnnouncementByID($id: ID!) {
    getAnnouncement(id: $id) {
      id
      title
      description
    }
  }
`;

export const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: ID!, $title: String!, $description: String!) {
    updateAnnouncement(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id)
  }
`;