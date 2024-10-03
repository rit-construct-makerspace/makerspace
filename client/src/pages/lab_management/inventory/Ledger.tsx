import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, Stack, Table, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { useLazyQuery, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import { GET_LEDGERS } from "../../../queries/inventoryQueries";
import AuditLogEntity from "../audit_logs/AuditLogEntity";
import DeleteIcon from '@mui/icons-material/Delete';
import { InventoryLedger } from "../../../types/InventoryItem";
import { endOfDay, format, parse, startOfDay } from "date-fns";
import { query } from "express";
import { useLocation, useNavigate } from "react-router-dom";



export default function Ledger() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>("");
  const [startDateTime, setStartDateTime] = useState();
  const [stopDateTime, setStopDateTime] = useState();

  const [query, queryResult] = useLazyQuery(GET_LEDGERS);


  const matchingItems = queryResult.data?.Ledgers.filter((i: InventoryLedger) => {
    var searchString = i.category + " " + i.initiator.firstName + " " + i.initiator.lastName + " " + i.items.toString() + " " + i.purchaser?.firstName + " " + i.purchaser?.lastName + " " + i.totalCost + " ";
    return searchString.toLowerCase().includes(searchText.toLowerCase())
  });

  const safeData = queryResult.data?.Ledgers ?? [];

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

  function parseDateForQuery(
    dateString: string,
    dayShifter: (d: Date) => Date
  ): Date | null {
    if (!dateString) return null;
    return dayShifter(parse(dateString, "yyyy-MM-dd", new Date()));
  }

  const showClearButton =
    startDateString || stopDateString || search.includes("q=");

  return (
    <RequestWrapper loading={queryResult.loading} error={queryResult.error}>
      <Box>
        <PageSectionHeader>Ledger</PageSectionHeader>

        <Stack direction="row" alignItems="center" spacing={1}>
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
            placeholder="Search ledger"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClear={() => setSearchText("")}
          />
          {/* <Button
            variant="outlined"
            startIcon={<CreateIcon />}
            onClick={() => setModalItemId("new")}
            sx={{ height: 40 }}
          >
            New material
          </Button> */}
        </Stack>

        <Table sx={{ 'td': { p: 0 } }}>
          <TableHead>
            <TableCell>Timestamp</TableCell>
            <TableCell>Initiator</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Total Cost</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Actions</TableCell>
          </TableHead>
          {matchingItems && matchingItems.map((item: InventoryLedger) => (
            <TableRow>
              <TableCell>{format(new Date(Number(item.timestamp)), "M/d/yy h:mmaaa")}</TableCell>
              <TableCell><AuditLogEntity entityCode={`user:${item.initiator.id}:${item.initiator.firstName} ${item.initiator.lastName}`} /></TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>$ {item.totalCost.toFixed(2)}</TableCell>
              <TableCell>{item.notes}</TableCell>
              <TableCell>
                <Table>
                  {item.items.map((subItem: {quantity: number, name: string}) => (
                    <TableRow>
                      <TableCell>{subItem.quantity}x</TableCell>
                      <TableCell>{subItem.name}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              </TableCell>
              <TableCell><IconButton color="error"><DeleteIcon /></IconButton></TableCell>
            </TableRow>
          ))}
        </Table>
      </Box>
    </RequestWrapper>
  );
}

