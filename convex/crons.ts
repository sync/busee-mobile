import { cronJobs } from 'convex/server';

import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'refresh altona tracker',
  { minutes: 1 },
  internal.tracker.refreshAltonaFromSource,
);

export default crons;
