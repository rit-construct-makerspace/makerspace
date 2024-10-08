import { gql, useQuery } from "@apollo/client";
import Page from "../../Page";
import {Button, Grid, Stack, Typography} from "@mui/material";
import {useCallback} from "react";
import {redirect, useNavigate} from "react-router-dom";
import RequestWrapper from "../../../common/RequestWrapper";
import Markdown from "react-markdown";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Privilege from "../../../types/Privilege";

const GET_TERMS_TEXT = gql`
    query GetTermsText {
        getTerms
    }
`;

export default function TermsPage() {
    const text = useQuery(GET_TERMS_TEXT);
    const currentUser = useCurrentUser();
    const navigate = useNavigate();

    return (
        <Page title="Terms and Conditions" maxWidth="1250px"
        topRightAddons={currentUser.privilege == Privilege.STAFF &&
            <Button variant="outlined" onClick={() => navigate('/admin/terms') }>Edit</Button>
        }>
            <RequestWrapper loading={text.loading} error={text.error}>
                <Markdown>{text.data?.getTerms}</Markdown>
            </RequestWrapper>
        </Page>
    );
}
