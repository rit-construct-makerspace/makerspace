export default interface Room {
  id: number;
  name: string;
}

export default interface ZoneHour {
  id: number;
  zone: string;
  type: string;
  dayOfTheWeek: number;
  time: string;
}
