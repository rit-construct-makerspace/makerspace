export default interface Room {
  id: number;
  name: string;
}

export default interface Zone {
  id: number;
  name: string;
}

export default interface ZoneHour {
  id: number;
  zoneID: number;
  type: string;
  dayOfTheWeek: number;
  time: string;
}

export interface FullRoom {
  id: number;
  name: string;
  equipment: {
    id: number;
    name: string;
    imageUrl: string;
    sopUrl: string;
    trainingModules: {
      id: number;
      name: string;
    }[];
    numAvailable: number;
    numInUse: number;
    byReservationOnly: boolean;
  }[];
}
