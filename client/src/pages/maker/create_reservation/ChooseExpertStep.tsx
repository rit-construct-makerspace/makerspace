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

function intToDayOfWeek(dayIndex: number) {
    switch(dayIndex) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
        default:
            return 'Invalid day';
    }
}

function intToMonth(monthIndex: number) {
    switch(monthIndex) {
        case 0:
            return 'January';
        case 1:
            return 'February';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        case 11:
            return 'December';
        default:
            return 'Invalid month';
    }
}

function intToOrdinal(n: number) {
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;

    if (lastTwoDigits === 11 || lastTwoDigits === 12 || lastTwoDigits === 13) {
        return n + 'th';
    }

    switch (lastDigit) {
        case 1:
            return n + 'st';
        case 2:
            return n + 'nd';
        case 3:
            return n + 'rd';
        default:
            return n + 'th';
    }
}

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
        <Typography sx={{fontSize: {xs:'13px', sm:'16px'}, mb:1}}>
            Select a day to meet with an expert:
        </Typography>
        <Stack direction="row" spacing={1}>
            <TextField
                label="Date"
                type="date"
                size="small"
                InputLabelProps={{shrink: true}}
                sx={{width: 180}}
                value={dateString}
                onChange={handleDateChange("date", setDateString)}
            />
            <Stack direction="column">
                <Typography variant="h6" component="div" sx={{ lineHeight: 1 }}>
                    {dateString!=="" ? intToDayOfWeek(new Date(dateString + "T00:00:00").getDay()) : ""}
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    {dateString!=="" ? intToMonth(new Date(dateString + "T00:00:00").getMonth()) + " " + intToOrdinal(new Date(dateString + "T00:00:00").getDate()) : ""}
                </Typography>
            </Stack>
        </Stack>

        <RequestWrapper2
            result={availabilityQueryResult}
            render={(data) => {
                return(
                    <>
                        <Typography variant="body1" marginBottom={1} fontSize={{xs: 13, sm: 16}}>
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
