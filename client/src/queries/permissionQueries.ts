import { gql } from "graphql-tag";

/**
 * @param userID id of user to change
 * @param admin boolean of wheather the user is an admin
 * @returns boolean for target user's admin state
 */
export const SET_USER_ADMIN = gql`
    mutation SetUserAdmin($userID: ID!, $admin: Boolean) {
        setUserAdmin(userID: $userID, admin: $admin)
    }
`;