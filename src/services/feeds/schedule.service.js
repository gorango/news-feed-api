import schedule from 'node-schedule';
import { updateFeeds, cleanUpFeeds } from './update.service';

export function scheduleFeedsUpdate() {
  return schedule.scheduleJob('*/15 * * * *', updateFeeds);
}

export function scheduleFeedsCleanup() {
  const time = { hour: 0 };
  return schedule.scheduleJob(time, cleanUpFeeds);
}
