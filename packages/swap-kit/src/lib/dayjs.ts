import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(duration);


export function countdownTo(futureTime) {
  const now = dayjs();
  const future = dayjs(futureTime);
  if (now.isAfter(future)) {
    return `Ended on ${future.format('MMMM D,h:mm A')}`;
  }
  const diff = dayjs.duration(future.diff(now));
  const days = diff.days();
  const hours = diff.hours().toString().padStart(2, '0');
  const minutes = diff.minutes().toString().padStart(2, '0');
  const seconds = diff.seconds().toString().padStart(2, '0');
  return `${days} day ${hours}:${minutes}:${seconds}`;
}


export default dayjs;
