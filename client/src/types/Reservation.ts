import User from "./User";
import Equipment from "./Equipment";

export interface ReservationAttachment {
  name: string;
  url: string;
}

export default interface Reservation {
  id: number;
  maker: User;
  equipment: Equipment;
  startTime: string;
  endTime: string;
  comment: string;
  attachments: ReservationAttachment[];
}
