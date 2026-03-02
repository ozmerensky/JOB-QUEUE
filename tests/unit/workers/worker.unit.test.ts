import { JobQueue } from '../../../src/models/jobQueue';
import { Worker } from '../../../src/workers/worker';
import { createPendingEmailJob, createPendingTaskJob } from '../../factories/job.factory';

describe('Worker', () => {
  let queue: JobQueue;
  let worker: Worker;

  beforeEach(() => {
    queue = new JobQueue();
    worker = new Worker(queue);
  });

  it('should process a single email job', () => {
    const pendingEmailJob = createPendingEmailJob();
    queue.addJob(pendingEmailJob);
    const job = worker.processNextJob();

    expect(job).toBe(pendingEmailJob);
    expect(queue.getAllJobs()[0].status).toBe('completed');
  });

  it('should process a single task job', () => {
    const pendingTaskJob = createPendingTaskJob();
    queue.addJob(pendingTaskJob);
    const job = worker.processNextJob();

    expect(job).toBe(pendingTaskJob);
    expect(queue.getAllJobs()[0].status).toBe('completed');
  });

  it('should return undefined if no pending job', () => {
    const result = worker.processNextJob();
    expect(result).toBeUndefined();
  });
});