import {Rooms} from "../../models/rooms/rooms";
import { knex } from "../../db";
import {singleRoomToDomain, roomsToDomain} from "../../mappers/rooms/roomMapper";

export interface IRoomRepo {
    getRoomByID(logID: number): Promise<Rooms | null>;
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
                "name"
            )
            .from("Rooms")
            .where("id", roomID);

        return singleRoomToDomain(knexResult);
    }

    async getRooms(): Promise<Rooms[]> {
        const knexResult = await this.queryBuilder("Rooms").select(
            "Rooms.id",
            "Rooms.name"
        );
        return roomsToDomain(knexResult)
    }

    async addRoom(room: Rooms): Promise<Rooms | null> {
        const newID = (
            await this.queryBuilder("Rooms").insert(
                {
                    name: room.name
                },
                "id"
            )
        )[0];
        return await this.getRoomByID(newID);
    }

    async removeRoom(roomID: number): Promise<void> {
        await this.queryBuilder("Rooms").where({id: roomID}).del();
    }

    async updateRoomName(roomID: number, name: string): Promise<Rooms | null> {
        const updateName = await this.queryBuilder("Rooms")
            .where({id: roomID})
            .update({
                name: name
            });

        return await this.getRoomByID(roomID);
    }

    async addEquipmentToRoom(roomID: number, equipmentID: number): Promise<Rooms | null> {
        await this.queryBuilder("EquipmentForRooms").insert(
            {
                roomID: roomID,
                equipmentID: equipmentID
            },
            "id"
        );

        const updateEquipRoom = await this.queryBuilder("Equipment")
            .where({id: equipmentID})
            .update({
                roomID: roomID
            });
        return await this.getRoomByID(roomID);
    }

    async removeEquipmentFromRoom(roomID: number, equipmentID: number): Promise<Rooms | null> {
        await this.queryBuilder("EquipmentForRooms")
            .where("roomID", "=", roomID)
            .where("equipmentID", "=", equipmentID).del();

        const updateEquipRoom = await this.queryBuilder("Equipment")
            .where({id: equipmentID})
            .update({
                roomID: null
            });
        return await this.getRoomByID(roomID);

        return await this.getRoomByID(roomID);
    }

    async addLabbieToRoom(roomID: number, labbieID: number): Promise<Rooms | null> {
        await this.queryBuilder("LabbiesForRooms").insert(
            {
                roomID: roomID,
                labbieID: labbieID
            },
            "id"
        );

        const updateLabbieRoom = await this.queryBuilder("User")
            .where({id: labbieID})
            .update({
                roomID: roomID,
                monitoringRoomID: roomID
            });
        return await this.getRoomByID(roomID);
    }

    async removeLabbieFromRoom(roomID: number, labbieID: number): Promise<Rooms | null> {
        await this.queryBuilder("LabbiesForRooms")
            .where("roomID", "=", roomID)
            .where("labbieID", "=", labbieID).del();

        const updateLabbieRoom = await this.queryBuilder("User")
            .where({id: labbieID})
            .update({
                roomID: null,
                monitoringRoomID: null
            });

        return await this.getRoomByID(roomID);
    }

    async addUserToRoom(roomID: number, userID: number): Promise<Rooms | null> {
        await this.queryBuilder("UsersForRooms").insert(
            {
                roomID: roomID,
                userID: userID
            },
            "id"
        );

        const updateLabbieRoom = await this.queryBuilder("User")
            .where({id: userID})
            .update({
                roomID: roomID
            });
        return await this.getRoomByID(roomID);
    }

    async removeUserFromRoom(roomID: number, userID: number): Promise<Rooms | null> {
        await this.queryBuilder("UsersForRooms")
            .where("roomID", "=", roomID)
            .where("userID", "=", userID).del();

        const updateLabbieRoom = await this.queryBuilder("User")
            .where({id: userID})
            .update({
                roomID: null
            });

        return await this.getRoomByID(roomID);
    }


}