import { gql, useMutation, useQuery } from "@apollo/client";
import Page from "../../Page";
import { Button, Grid, Stack, TextareaAutosize, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import RequestWrapper from "../../../common/RequestWrapper";
import Markdown from "react-markdown";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Privilege from "../../../types/Privilege";
import AdminPage from "../../AdminPage";

const GET_TERMS_TEXT = gql`
    query GetTermsText {
        getTerms
    }
`;

const SET_TERMS_TEXT = gql`
    mutation SetTermsText($value: String) {
        setTerms(value: $value)
    }
`;

export default function EditTermsPage() {
    const text = useQuery(GET_TERMS_TEXT);
    const [edit] = useMutation(SET_TERMS_TEXT, {refetchQueries: [{query: GET_TERMS_TEXT}]});
    const currentUser = useCurrentUser();
    const navigate = useNavigate();

    const [editText, setEditText] = useState<string>();

    return (
        <AdminPage title="Edit Terms and Conditions" maxWidth="1250px"
            topRightAddons={currentUser.privilege == Privilege.STAFF &&
                <Button variant="outlined" onClick={() => navigate('/terms')}>View</Button>
            }>
            <RequestWrapper loading={text.loading} error={text.error}>
                <>
                    {currentUser.privilege == Privilege.STAFF &&
                        <>
                            <TextareaAutosize
                                style={{ background: "none", fontFamily: "Roboto", fontSize: "1em", lineHeight: "2em", marginTop: "2em", marginBottom: "2em" }}
                                defaultValue={text.data?.getTerms}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                            ></TextareaAutosize>
                            <Button
                                variant="contained"
                                onClick={() => edit({ variables: { value: editText } })}
                                sx={{ mt: 8, alignSelf: "flex-end" }}
                            >
                                Update
                            </Button>
                        </>}
                </>
            </RequestWrapper>

        </AdminPage>
    );
}
