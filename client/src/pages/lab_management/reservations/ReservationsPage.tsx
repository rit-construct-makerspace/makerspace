import React from "react";
import Page from "../../Page";
import PageSectionHeader from "../../../common/PageSectionHeader";
import ReservationCard from "./ReservationCard";
import Reservations from "../../../test_data/Reservations";
import AdminPage from "../../AdminPage";

export default function ReservationsPage() {
  return (
    <AdminPage title="Reservations" maxWidth="1250px">
      <PageSectionHeader top>Your Pending Reservations</PageSectionHeader>

      {Reservations.pending.map((r) => (
        <ReservationCard key={r.id} reservation={r} />
      ))}
      <PageSectionHeader>Your Confirmed Reservations</PageSectionHeader>
      <PageSectionHeader>All Reservations</PageSectionHeader>
    </AdminPage>
  );
}
