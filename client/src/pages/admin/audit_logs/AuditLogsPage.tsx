import React from "react";
import Page from "../../Page";
import { Divider, Stack } from "@mui/material";
import Logs from "../../../test_data/Logs";
import SearchBar from "../../../common/SearchBar";
import PageSectionHeader from "../../../common/PageSectionHeader";
import AuditLogRow from "../../../common/AuditLogRow";


interface LogPageProps {}

export default function LogPage({}: LogPageProps) {

    return (
        <Page title="Logs">

            <PageSectionHeader>Audit Logs</PageSectionHeader>

            <SearchBar placeholder="Search" />
            <Stack divider={<Divider flexItem />} mt={2}>
                {Logs.map((log) => (
                    <AuditLogRow
                        log={log}
                        key={log.id}
                    />
                ))}
            </Stack>
        </Page>
    );
}
