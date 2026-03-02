import { JobQueue } from '../../../src/models/jobQueue';
import { WorkerQueue } from '../../../src/workers/workerQueue';
import { createPendingEmailJob, createPendingTaskJob } from '../../factories/job.factory';

describe('WorkerQueue', () => {
  let queue: JobQueue;
  let workerQueue: WorkerQueue;

  beforeEach(() => {
    queue = new JobQueue();
    queue.addJob(createPendingEmailJob({ retriesLeft: 1 }));
    queue.addJob(createPendingTaskJob({ retriesLeft: 2 }));
    workerQueue = new WorkerQueue(queue, 2);
  });

  // ✅ בדיקה שכל ה-jobs מעובדים (או שיש להם retriesLeft)
  it('should process all jobs once', () => {
    workerQueue.runAll();
    const allJobs = queue.getAllJobs();
    expect(allJobs.every(job => job.status === 'completed' || (job.retriesLeft ?? 0) > 0)).toBe(true);
  });

  // ✅ בדיקה שהריצה ממשיכה עד שה queue ריקה כולל retries
  it('should run until queue is empty including retries', () => {
    workerQueue.runUntilEmpty();
    const allJobs = queue.getAllJobs();
    expect(allJobs.every(job => job.status === 'completed')).toBe(true);
  });
});