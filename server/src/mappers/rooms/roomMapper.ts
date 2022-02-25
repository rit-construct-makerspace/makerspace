import {Room} from "../../models/rooms/room";

export function roomsToDomain(raw: any): Room[] {
    const result = raw.map((i: any) => {
        return singleRoomToDomain(i);
    })
    return result;
}

export function singleRoomToDomain(raw: any): Room | null {
    if (raw === undefined || raw === null) return null;
    const value: Room = {
        id: raw.id,
        name: raw.name,
    }
    return value;
}