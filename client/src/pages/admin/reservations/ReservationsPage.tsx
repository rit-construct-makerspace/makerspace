import React from "react";
import Page from "../../Page";
import PageSectionHeader from "../../../common/PageSectionHeader";
import ReservationCard from "./ReservationCard";
import Reservations from "../../../test_data/Reservations";

interface ReservationsPageProps {}

export default function ReservationsPage({}: ReservationsPageProps) {
  return (
    <Page title="Reservations">
      <PageSectionHeader top>Your Pending Reservations</PageSectionHeader>

      {Reservations.pending.map((r) => (
        <ReservationCard key={r.id} reservation={r} />
      ))}
      <PageSectionHeader>Your Confirmed Reservations</PageSectionHeader>
      <PageSectionHeader>All Reservations</PageSectionHeader>
    </Page>
  );
}
