import { gql } from "@apollo/client";

export interface MakeEvent {
    name: {
        text: string;
        html: string;
    };
    description: {
        text: string;
        html: string;
    };
    url: string;
    start: {
        timezone: any;
        local: string;
        utc: any;
    };
    end: {
        timezone: any;
        local: string;
        utc: any;
    };
    summary: string;
    logo: {
        url: string;
    };
}

export const GET_EVENTS = gql`
  query Events {
    events {
      name {
        text
        html
      }
      description {
        text
        html
      }
      url
      start {
        timezone
        local
        utc
      }
      end {
        timezone
        local
        utc
      }
      summary
      logo {
        url
      }
    }
  }
`;

export default GET_EVENTS;