import {Rooms} from "../../models/rooms/rooms";

export function roomsToDomain(raw: any): Rooms[] {
    const result = raw.map((i: any) => {
        return singleRoomToDomain(i);
    })
    return result;
}

export function singleRoomToDomain(raw: any): Rooms | null {
    if (raw === undefined || raw === null) return null;
    const value: Rooms = {
        id: raw.id,
        name: raw.name,
        isOpen: raw.isOpen,
    }
    return value;
}