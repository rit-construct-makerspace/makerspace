import { gql } from "@apollo/client";
import Equipment from "../types/Equipment";

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
  }];
}

export interface FullZone {
  id: number;
  name: string;
  hours: {
    type: string;
    dayOfTheWeek: number;
    time: string;
  }[];
  rooms: {
    id: number;
    name: string;
    equipment: {
      id: number;
      name: string;
      imageUrl: string;
      sopUrl: string;
      trainingModules: {
        id: number;
        name: string;
      }[];
      numAvailable: number;
      numInUse: number;
    }[];
  }[]
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

export const GET_FULL_ZONES = gql`
  query GetZones {
    zones {
      id
      name
      hours {
        type
        dayOfTheWeek
        time
      }
      rooms {
        id
        name
        equipment {
          id
          name
          imageUrl
          sopUrl
          trainingModules {
            id
            name
          }
          numAvailable
          numInUse
        }
      }
    }
  }
`;