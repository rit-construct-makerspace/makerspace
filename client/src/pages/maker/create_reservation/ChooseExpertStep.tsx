import React, {ChangeEvent, useEffect, useState} from "react";
import {Stack, TextField, Typography} from "@mui/material";
import CollectiveExpertAvailabilityCard from "./CollectiveExpertAvailabilityCard";
import TestData from "../../../test_data/CollectiveExpertAvailability.json";
import ExpertAvailability from "../../../types/ExpertAvailability";
import {useLocation, useNavigate} from "react-router-dom";
import {useLazyQuery, useQuery} from "@apollo/client";
import {GET_AVAILABILITY_BY_DATE} from "../../../queries/availabilityQueries";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import CollectiveExpertAvailability from "../../../types/CollectiveExpertAvailability";
import {AvailabilitySlot} from "../../../../../server/src/schemas/availabilitySchema";
import {GET_USER} from "../../../queries/userQueries";
import TimeSlot from "../../../types/TimeSlot";

function parseDate(dateString: string): string | null {
    if(dateString != "" && dateString != null){
        return new Date(dateString).getTime() + ""
    } else {
        return null
    }
}

interface ChooseExpertStepProps {
  stepForwards: () => void;
  onExpertClick: (expert: ExpertAvailability) => void;
}

export default function ChooseExpertStep({
  stepForwards,
  onExpertClick,
}: ChooseExpertStepProps) {

    const [dateString, setDateString] = useState("");
    const navigate = useNavigate();
    const {search} = useLocation();
    const [expertQuery, expertResult] = useLazyQuery(GET_USER)

    const [collectiveAvailability, setCollectiveAvailability] = useState<CollectiveExpertAvailability>()
    const [availabilityQuery, availabilityQueryResult ] = useLazyQuery(GET_AVAILABILITY_BY_DATE, {
        onCompleted: async (data) => {
            setCollectiveAvailability({
                dayOfWeek: "Monday",
                dateString: "Tuesday",
                expertAvailabilities:  await Promise.all(Array.from(new Set(data.availabilityByDate.map((slot: AvailabilitySlot) => slot.userID))).map((id):ExpertAvailability => {
                    return {
                        expert: {
                            name: "a",
                            avatarHref: "https://speaking.com/wp-content/uploads/2017/06/Adam-Savage.jpg",
                            id: id as string,
                            about: "hi",
                        },
                        availability: data.availabilityByDate.filter((slot: AvailabilitySlot) => {
                            return (slot.userID === id as number)}).map((slot: AvailabilitySlot) => {
                            return{
                                startTime: slot.startTime,
                                endTime: slot.endTime
                            }
                        })
                    }
                }))
            })
        }
    })


    useEffect(() => {
        const date = new URLSearchParams(search).get("date") ?? ""

        setDateString(date)

        if(date != ""){
            availabilityQuery({
                variables: {
                    date: parseDate(date),
                }
            })
        }


    }, [search, availabilityQuery])

    const handleDateChange = (paramName: string, setter: (s: string) => void) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            setUrlParam(paramName, e.target.value);
        };

    const setUrlParam = (paramName: string, paramValue: string) => {
        const params = new URLSearchParams(search);
        params.set(paramName, paramValue);
        navigate("/create-reservation?" + params, {replace: true});
    };

    return (
    <>
        Select a day to make a reservation:
        <br/>
        <br/>
        <TextField
            label="Date"
            type="date"
            size="small"
            InputLabelProps={{shrink: true}}
            sx={{width: 180}}
            value={dateString}
            onChange={handleDateChange("date", setDateString)}
        />

        <RequestWrapper2
            result={availabilityQueryResult}
            render={(data) => {
                return(
                    <>
                        <Typography variant="body1" marginY={2}>
                            Our experts are here to help you use machines and equipment in a safe
                            and effective manner.
                            <br/>
                            Select an expert's schedule below to get started.
                        </Typography>
                        {collectiveAvailability ? <CollectiveExpertAvailabilityCard
                            key={collectiveAvailability.dateString}
                            collectiveExpertAvailability={collectiveAvailability}
                            onExpertClick={onExpertClick}
                        /> : null}
                    </>
                )
            }}
        />
    </>
  );
}
