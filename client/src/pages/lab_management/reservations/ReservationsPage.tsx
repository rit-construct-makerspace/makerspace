import React, { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_EXPERT_RESERVATION_FOR_CARD, GET_RESERVATION_IDS_PER_EXPERT } from "../../../queries/reservationQueries";
import Reservation from "../../../types/Reservation";
import Page from "../../Page";
import PageSectionHeader from "../../../common/PageSectionHeader";
import ReservationCard from "./ReservationCard";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function ReservationsPage() {
    const navigate = useNavigate();
    const { data: idsData, loading: idsLoading, error: idsError } = useQuery(GET_RESERVATION_IDS_PER_EXPERT, {variables: {expertID: 1}});
    const [fetchReservation, { called, loading, data }] = useLazyQuery(GET_EXPERT_RESERVATION_FOR_CARD);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        if (idsData) {
            idsData.reservationIDsByExpert.forEach((id: number) => {
                fetchReservation({ variables: { id } });
            });
        }
    }, [idsData, fetchReservation]);

    useEffect(() => {
        if (data) {
            setReservations(prev => [...prev, data.reservationForCard]);
        }
    }, [data]);

    if (idsLoading) return <div>Loading...</div>;
    if (idsError) return <div>Error: {idsError.message}</div>;

    return (
        <Page title="Reservations" maxWidth="1250px">
            <Button onClick={() => navigate('/admin/reservations/availability')}>Set your availability here.</Button>
            <PageSectionHeader top>Your Pending Reservations</PageSectionHeader>

            {reservations.map((r: Reservation) => (
                <ReservationCard key={r.id} reservation={r} />
            ))}
            <PageSectionHeader>Your Confirmed Reservations</PageSectionHeader>
            <PageSectionHeader>All Reservations</PageSectionHeader>
        </Page>
    );
}