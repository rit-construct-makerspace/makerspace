export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  ritUsername: string;
}

export interface StaffShift {
  id: number;
  makerspaceID: number;
  userID: number;
  start: string;
  end: string;
  user: StaffMember;
}

export interface StaffShiftEvent {
  title: React.ReactNode;
  start: Date;
  end: Date;
  isDraggable: boolean;
  shift: StaffShift;
}
