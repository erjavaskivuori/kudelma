import { fromZonedTime } from 'date-fns-tz';

const TZ_FINLAND = 'Europe/Helsinki';

export function getNextChangeTimestamp(): number {
  const now = new Date();

  const finlandNow = new Date(
    now.toLocaleString('en-US', { timeZone: TZ_FINLAND })
  );

  const hours = finlandNow.getHours();

  let nextHour: number;
  let addDay = false;

  if (hours < 6) nextHour = 6;
  else if (hours < 12) nextHour = 12;
  else if (hours < 18) nextHour = 18;
  else {
    nextHour = 0;
    addDay = true;
  }

  const nextChange = new Date(finlandNow);
  nextChange.setHours(nextHour, 0, 0, 0);

  if (addDay) {
    nextChange.setDate(nextChange.getDate() + 1);
  }

  const utcDate = fromZonedTime(nextChange, TZ_FINLAND);

  // Change to UNIX timestamp in seconds
  return Math.floor(utcDate.getTime() / 1000);
}
