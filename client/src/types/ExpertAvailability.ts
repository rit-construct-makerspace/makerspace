import TimeSlot from "./TimeSlot";
import Expert from "./Expert";

export default interface ExpertAvailability {
  expert: Expert;
  availability: TimeSlot[];
}
