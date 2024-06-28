/** room.ts
 * Object Model for Rooms
 */
export interface Room {
    id: number;
    name: string;
    pictureURL: string;
    archived: boolean;
}