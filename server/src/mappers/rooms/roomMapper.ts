import { Room } from "../../models/rooms/room";

export function roomsToDomain(raw: any): Room[] {
  return raw.map((i: any) => {
    return singleRoomToDomain(i);
  });
}

export function singleRoomToDomain(raw: any): Room | null {
  if (!raw) return null;

  return {
    id: parseInt(raw.id),
    name: raw.name,
  };
}
