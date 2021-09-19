import Person from "./Person";
import TimeSlot from "./TimeSlot";

export default interface ExpertAvailability {
  expert: Person;
  availability: TimeSlot[];
}
