import { gql } from "@apollo/client";

export interface Announcement {
  id: string;
  title: string;
  description: string;
  postDate: Date;
  expDate: Date;
}

export const GET_ANNOUNCEMENTS = gql`
  query GetAnnouncements {
    announcements {
      id
      title
      description
      postDate
      expDate
    }
  }
`;