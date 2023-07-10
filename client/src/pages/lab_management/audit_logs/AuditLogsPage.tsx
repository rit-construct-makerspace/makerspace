import React, { ChangeEvent, useEffect, useState } from "react";
import Page from "../../Page";
import {
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import { useLazyQuery } from "@apollo/client";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import AuditLogRow from "./AuditLogRow";
import { useLocation, useNavigate } from "react-router-dom";
import { endOfDay, parse, startOfDay } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import { GET_LOGS } from "../../../queries/auditLogQueries";


function parseDateForQuery(
  dateString: string,
  dayShifter: (d: Date) => Date
): Date | null {
  if (!dateString) return null;
  return dayShifter(parse(dateString, "yyyy-MM-dd", new Date()));
}

export default function LogPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [query, queryResult] = useLazyQuery(GET_LOGS);
  const [searchText, setSearchText] = useState("");

  const [startDateString, setStartDateString] = useState("");
  const [stopDateString, setStopDateString] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const startDate = searchParams.get("start") ?? "";
    const stopDate = searchParams.get("stop") ?? "";
    const queryString = searchParams.get("q") ?? "";

    setStartDateString(startDate);
    setStopDateString(stopDate);
    setSearchText(queryString);

    query({
      variables: {
        startDate: parseDateForQuery(startDate, startOfDay),
        stopDate: parseDateForQuery(stopDate, endOfDay),
        searchText: queryString,
      },
    });
  }, [search, query]);

  const setUrlParam = (paramName: string, paramValue: string) => {
    const params = new URLSearchParams(search);
    params.set(paramName, paramValue);
    navigate("/admin/history?" + params, { replace: true });
  };

  const handleDateChange =
    (paramName: string, setter: (s: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setUrlParam(paramName, e.target.value);
    };

  const handleClear = () => {
    setSearchText("");
    navigate("/admin/history", { replace: true });
  };

  const showClearButton =
    startDateString || stopDateString || search.includes("q=");

  return (
    <Page title="History" maxWidth="1250px">
      <Stack direction="row" spacing={2}>
        <TextField
          label="Start"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ width: 180 }}
          value={startDateString}
          onChange={handleDateChange("start", setStartDateString)}
        />
        <TextField
          label="Stop"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ width: 180 }}
          value={stopDateString}
          onChange={handleDateChange("stop", setStopDateString)}
        />
        <SearchBar
          hideClearButton
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSubmit={() => setUrlParam("q", searchText)}
        />
        {showClearButton && (
          <IconButton onClick={handleClear} sx={{ ml: "8px !important" }}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <RequestWrapper2
        result={queryResult}
        render={(data) => {
          if (data.auditLogs.length === 0) {
            return (
              <Typography
                variant="body1"
                sx={{
                  fontStyle: "italic",
                  color: "grey.700",
                  mx: "auto",
                  my: 8,
                }}
              >
                No results.
              </Typography>
            );
          }
          return (
            <Stack divider={<Divider flexItem />} mt={4} spacing={2}>
              {data.auditLogs.map((log: any) => (
                <AuditLogRow
                  key={log.id}
                  dateTime={log.dateTime}
                  message={log.message}
                />
              ))}
            </Stack>
          );
        }}
      />
    </Page>
  );
}
