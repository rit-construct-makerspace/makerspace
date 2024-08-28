import { gql } from "@apollo/client";

export const GET_ZONES = gql`
 query GetZones {
  zones {
    id
    name
  }
 }
`;

export interface ZoneWithHours {
  id: number;
  name: string;
  hours: [{
    type: string;
    dayOfTheWeek: number;
    time: string;
  }]
}

export const GET_ZONES_WITH_HOURS = gql`
 query GetZonesWithHours {
  zones {
    id
    name
    hours {
      type
      dayOfTheWeek
      time
    }
  }
 }
`;