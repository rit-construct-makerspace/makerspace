import ExpertAvailability from "./ExpertAvailability";

export default interface CollectiveExpertAvailability {
  dayOfWeek: string;
  dateString: string;
  expertAvailabilities: ExpertAvailability[];
}
