import Equipment from "./Equipment";

export default interface AccessCheck {
    id: number;
    userID: number;
    readyDate: Date;
    approved: boolean;
    equipment: Equipment;
}