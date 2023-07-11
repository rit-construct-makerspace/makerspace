import React from "react";
import Page from "../../Page";
import PageSectionHeader from "../../../common/PageSectionHeader";
import ReservationCard from "./ReservationCard";
import Reservations from "../../../test_data/Reservations";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

export default function ReservationsPage() {
    const navigate = useNavigate();
  return (
    <Page title="Reservations" maxWidth="1250px">
      <Button onClick={() => navigate('/admin/reservations/availability')}>Set your availability here.</Button>
      <PageSectionHeader top>Your Pending Reservations</PageSectionHeader>

      {Reservations.pending.map((r) => (
        <ReservationCard key={r.id} reservation={r} />
      ))}
      <PageSectionHeader>Your Confirmed Reservations</PageSectionHeader>
      <PageSectionHeader>All Reservations</PageSectionHeader>
    </Page>
  );
}
