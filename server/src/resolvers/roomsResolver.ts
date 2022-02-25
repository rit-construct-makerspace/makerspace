import {EquipmentRepository} from "../repositories/Equipment/EquipmentRepository";
import {UserRepository} from "../repositories/Users/UserRepository";
import {RoomRepo} from "../repositories/Rooms/RoomRepository";

const er = new EquipmentRepository();
const ur = new UserRepository();
const rr = new RoomRepo();

const RoomResolvers = {
    Query: {
        rooms: async (_: any, args: any, context: any) => {
            try {
                return await rr.getRooms();
            } catch (e) {
                console.log("Error:", e);
            }
        },
        room: async (_: any, args: any, context: any) => {
            try {
                return await rr.getRoomByID(args.id);
            } catch (e) {
                console.log("Error:", e);
            }
        },
        roomByEquipment: async (_: any, args: any, context: any) => {
            try {
                const equip = await er.getEquipmentById(args.equipmentID)
                if (equip) {
                    return await rr.getRoomByID(equip.room_id)
                }
            } catch (e) {
                console.log("Error:", e);
            }
        },
        roomByLabbie: async (_: any, args: any, context: any) => {
            try {
                const labbie = await ur.getUserByID(args.labbieID)
                if (labbie) {
                    return await rr.getRoomByID(labbie.room_id)
                }
            } catch (e) {
                console.log("Error:", e);
            }
        },
    },

    Mutation: {

        addRoom: async (_: any, args: any) => {
            try {
                return await rr.addRoom(args.room);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        removeRoom: async (_: any, args: any) => {
            try {
                return await rr.removeRoom(args.id);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        updateRoomName: async (_: any, args: any) => {
            try {
                return await rr.updateRoomName(args.id, args.name);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        addEquipmentToRoom: async (_: any, args: any) => {
            try {
                return await rr.addEquipmentToRoom(args.roomID, args.equipmentID);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        removeEquipmentFromRoom: async (_: any, args: any) => {
            try {
                return await rr.removeEquipmentFromRoom(args.roomID, args.equipmentID);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        addLabbieToRoom: async (_: any, args: any) => {
            try {
                return await rr.addLabbieToRoom(args.roomID, args.labbieID);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        removeLabbieFromRoom: async (_: any, args: any) => {
            try {
                return await rr.removeLabbieFromRoom(args.roomID, args.labbieID);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        addUserToRoom: async (_: any, args: any) => {
            try {
                return await rr.addUserToRoom(args.roomID, args.userID);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        removeUserFromRoom: async (_: any, args: any) => {
            try {
                return await rr.removeUserFromRoom(args.roomID, args.userID);
            } catch (e) {
                console.log("Error:", e);
            }
        },


    },
};

export default RoomResolvers;
