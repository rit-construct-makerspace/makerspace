import Equipment from "./Equipment";

export default interface Room {
  id: number;
  name: string;
  equipment: Equipment[];
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

/**
 * Attempt to depreciate in favor of Room
 */
export interface FullRoom {
  id: number;
  name: string;
  equipment: Equipment[];
}
