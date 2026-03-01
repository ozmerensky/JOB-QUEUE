import { JobQueue } from '../../../src/models/jobQueue';
import { WorkerQueue } from '../../../src/workers/workerQueue';
import { createPendingEmailJob, createPendingTaskJob } from './mocks/jobsForWorkers';

describe('WorkerQueue', () => {
  let queue: JobQueue;
  let workerQueue: WorkerQueue;

  beforeEach(() => {
    queue = new JobQueue();
    queue.addJob(createPendingEmailJob());
    queue.addJob(createPendingTaskJob());
    workerQueue = new WorkerQueue(queue, 2);
  });

  it('should process all jobs once', () => {
    workerQueue.runAll();
    const allJobs = queue.getAllJobs();
    expect(allJobs.every(job => job.status === 'completed')).toBe(true);
  });

  it('should run until queue is empty', () => {
    workerQueue.runUntilEmpty();
    const allJobs = queue.getAllJobs();
    expect(allJobs.every(job => job.status === 'completed')).toBe(true);
  });
});