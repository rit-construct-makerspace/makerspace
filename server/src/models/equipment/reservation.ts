export enum ReservationStatus {
    "PENDING",
    "CONFIRMED",
    "CANCELLED"
}
export interface Reservation {
    id: number;
    makerID: number;
    createDate: Date;
    startTime: Date;
    endTime: Date;
    equipmentID: number;
    status: ReservationStatus;
    lastUpdated: Date;
}

interface MakerForCard{
    id: number;
    name: string;
    image: string;
    role: string;
}
interface EquipmentForCard{
    id: number;
    name: string;
    image: string;
}
interface ReservationAttachmentForCard{
    name: string;
    url: string;
}

export interface ReservationForCard {
    id: number;
    maker: MakerForCard;
    equipment: EquipmentForCard;
    startTime: string;
    endTime: string;
    comment: string;
    attachments: ReservationAttachmentForCard[];
    status: string;
}