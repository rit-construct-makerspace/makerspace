import { gql } from "@apollo/client";

export const GET_MAKERSPACE_STAFF = gql`
  query MakerspaceStaff($makerspaceID: Int!) {
    makerspaceStaff(makerspaceID: $makerspaceID) {
      id
      firstName
      lastName
      ritUsername
    }
  }
`;

export const GET_STAFF_SHIFTS = gql`
  query StaffShifts($makerspaceID: Int!, $start: String!, $end: String!) {
    staffShifts(makerspaceID: $makerspaceID, start: $start, end: $end) {
      id
      makerspaceID
      userID
      start
      end
      user {
        id
        firstName
        lastName
        ritUsername
      }
    }
  }
`;

export const CREATE_STAFF_SHIFTS = gql`
  mutation CreateStaffShifts($makerspaceID: Int!, $shifts: [StaffShiftTimeInput!]!) {
    createStaffShifts(makerspaceID: $makerspaceID, shifts: $shifts) {
      id
    }
  }
`;

export const UPDATE_STAFF_SHIFT = gql`
  mutation UpdateStaffShift($id: Int!, $start: String!, $end: String!) {
    updateStaffShift(id: $id, start: $start, end: $end) {
      id
    }
  }
`;

export const DELETE_STAFF_SHIFT = gql`
  mutation DeleteStaffShift($id: Int!) {
    deleteStaffShift(id: $id)
  }
`;
