/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 * 
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the amount of time
 */
export function secondsToHumanString(seconds: number) {
  var levels = [
    [Math.floor(seconds / 31536000), 'years'],
    [Math.floor((seconds % 31536000) / 86400), 'days'],
    [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
    [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
    [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
  ];
  var returntext = '';

  for (var i = 0, max = levels.length; i < max; i++) {
    if (levels[i][0] === 0) continue;
    returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].toString().substring(0, levels[i][1].toString().length - 1) : levels[i][1]);
  };
  return returntext.trim();
}

export function formatSecondsToHoursMinutes(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = '';
  if (hours > 0) {
    result += `${hours} hr\n`;
  }
  if (minutes > 0 || hours === 0) {
    result += `${minutes} min`;
  }

  return result.trim();
}

export function formatTimeToMillisecondsUTC(hours: number, minutes: number, seconds: number, milliseconds: number): number {
  var date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  date.setMilliseconds(milliseconds);
  return date.getTime();
}

export function getDateRange(earliestDate: Date, latestDate: Date, interval: number): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(earliestDate);
    
    // Ensure earliestDate starts at midnight
    currentDate.setHours(0, 0, 0, 0);
    
    while (currentDate <= latestDate) {
        dates.push(new Date(currentDate)); // Clone the date to avoid mutation
        currentDate.setDate(currentDate.getDate() + interval); // Move to the next day
        currentDate.setHours(0, 0, 0, 0); // Ensure each iteration resets to midnight
    }

    return dates;
}
