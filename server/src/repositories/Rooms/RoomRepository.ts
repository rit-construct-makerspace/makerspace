import {Rooms} from "../../models/rooms/rooms";
import { knex } from "../../db";
import {singleRoomToDomain, roomsToDomain} from "../../mappers/rooms/roomMapper";

export interface IRoomRepo {
    getRoomByID(logID: number): Promise<Rooms | null>;
    getRoomByEquipment(equipmentID: number): Promise<Rooms | null>;
    getRoomByLabbie(labbieID: number): Promise<Rooms | null>;
    getRoomsByIfOpen(isOpen: boolean): Promise<Rooms[]>;
    getRooms(): Promise<Rooms[]>;

    addRoom(room: Rooms): Promise<Rooms | null>;
    removeRoom(roomID: number): Promise<void>;

    updateRoomName(roomID: number, name: string): Promise<Rooms | null>;

    addEquipmentToRoom(roomID: number, equipmentID: number): Promise<Rooms | null>;
    removeEquipmentFromRoom(roomID: number, equipmentID: number): Promise<Rooms | null>;

    addUserToRoom(roomID: number, userID: number): Promise<Rooms | null>;
    removeUserFromRoom(roomID: number, userID: number): Promise<Rooms | null>;

    addLabbieToRoom(roomID: number, labbieID: number): Promise<Rooms | null>;
    removeLabbieFromRoom(roomID: number, labbieID: number): Promise<Rooms | null>;

    closeRoom(roomID: number): Promise<Rooms | null>;
    openRoom(roomID: number): Promise<Rooms | null>;
}

export class RoomRepo implements IRoomRepo {

    private queryBuilder;

    constructor(queryBuilder?: any) {
        this.queryBuilder = queryBuilder || knex;
    }

    async getRoomByID(roomID: number): Promise<Rooms | null> {
        const knexResult = await this.queryBuilder
            .first(
                "id",
                "name",
                "isOpen"
            )
            .from("Rooms")
            .where("id", roomID);

        return singleRoomToDomain(knexResult);
    }

    async getRoomByEquipment(equipmentID: number): Promise<Rooms | null> {

        const knexResult = await this.queryBuilder
            .first(
                "id",
                "name",
                "isOpen"
            )
            .from("Rooms")
            .where("id", null);

        return singleRoomToDomain(knexResult);
    }

    getRoomByLabbie(labbieID: number): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    getRoomsByIfOpen(isOpen: boolean): Promise<Rooms[]> {
        return Promise.resolve([]);
    }

    getRooms(): Promise<Rooms[]> {
        return Promise.resolve([]);
    }

    addEquipmentToRoom(roomID: number, equipmentID: number): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    addLabbieToRoom(roomID: number, labbieID: number): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    addRoom(room: Rooms): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    addUserToRoom(roomID: number, userID: number): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    closeRoom(roomID: number): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    openRoom(roomID: number): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    removeEquipmentFromRoom(roomID: number, equipmentID: number): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    removeLabbieFromRoom(roomID: number, labbieID: number): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    removeRoom(roomID: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    removeUserFromRoom(roomID: number, userID: number): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

    updateRoomName(roomID: number, name: string): Promise<Rooms | null> {
        return Promise.resolve(null);
    }

}