export const MODULE_PASSING_THRESHOLD = 80;

// 9 -> 9:00 AM, 17 -> 5:00 PM, etc.
export const LAB_HOURS = [
  { open: 12, close: 17 }, // sunday
  { open: 9, close: 21 }, // monday
  { open: 9, close: 21 }, // tuesday
  { open: 9, close: 21 }, // wednesday
  { open: 9, close: 21 }, // thursday
  { open: 9, close: 16 }, // friday
  { open: 12, close: 17 }, // saturday
];

// How long is each timeslot, in minutes?
export const TIMESLOT_DURATION = 30;

// How many days in advance do we generate timeslots?
export const TIMESLOT_ADVANCE_DAYS = 7;
