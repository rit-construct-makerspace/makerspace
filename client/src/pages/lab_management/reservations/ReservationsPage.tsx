import React, {useEffect, useState} from "react";
import {useApolloClient, useLazyQuery, useQuery} from "@apollo/client";
import {GET_EXPERT_RESERVATION_FOR_CARD, GET_RESERVATION_IDS_PER_EXPERT} from "../../../queries/reservationQueries";
import Reservation, {ReservationStatus} from "../../../types/Reservation";
import Page from "../../Page";
import PageSectionHeader from "../../../common/PageSectionHeader";
import ReservationCard from "./ReservationCard";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import {useCurrentUser} from "../../../common/CurrentUserProvider";

export default function ReservationsPage() {
    const navigate = useNavigate();
    const { data: idsData, loading: idsLoading, error: idsError } = useQuery(GET_RESERVATION_IDS_PER_EXPERT, { variables: { expertID: useCurrentUser().id } });
    const [fetchReservation, { loading, data }] = useLazyQuery(GET_EXPERT_RESERVATION_FOR_CARD);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const client = useApolloClient();

    const refreshReservations = async () => {
        await client.refetchQueries({
            include: [GET_RESERVATION_IDS_PER_EXPERT]
        });
    };

    useEffect(() => {
        const fetchReservations = async () => {
            if (idsData) {
                const fetchedReservations = await Promise.all(
                    idsData.reservationIDsByExpert.map(async (id: number) => {
                        const { data } = await fetchReservation({ variables: { id } });
                        return data.reservationForCard;
                    })
                );
                setReservations(fetchedReservations);
            }
        };

        fetchReservations();
    }, [idsData, fetchReservation]);

    if (idsLoading) return <div>Loading...</div>;
    if (idsError) return <div>Error: {idsError.message}</div>;

    return (
        <Page title="Reservations" maxWidth="1250px">
            <Button onClick={() => navigate('/admin/reservations/availability')}>Set your availability here.</Button>

            <PageSectionHeader top>Your Pending Reservations</PageSectionHeader>
            {reservations.filter(r => r.status === 'PENDING').map((r: Reservation) => (
                <ReservationCard key={r.id} reservation={r} onActionComplete={refreshReservations}/>
            ))}

            <PageSectionHeader>Your Confirmed Reservations</PageSectionHeader>
            {reservations.filter(r => r.status === "CONFIRMED").map((r: Reservation) => (
                <ReservationCard key={r.id} reservation={r} onActionComplete={refreshReservations}/>
            ))}

            <PageSectionHeader>All Reservations</PageSectionHeader>
            {reservations.filter(r => r.status === "CANCELLED").map((r: Reservation) => (
                <ReservationCard key={r.id} reservation={r} onActionComplete={refreshReservations}/>
            ))}
        </Page>
    );
}