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

  it('should process a single email job and mark it completed', () => {
    const job = createPendingEmailJob();
    queue.addJob(job);

    const processedJob = worker.processNextJob();

    expect(processedJob).toBe(job);
    expect(job.status).toBe('completed');
    expect(job.updatedAt.getTime()).toBeGreaterThan(job.createdAt.getTime());
  });

  it('should process a single task job and mark it completed', () => {
    const job = createPendingTaskJob();
    queue.addJob(job);

    const processedJob = worker.processNextJob();

    expect(processedJob).toBe(job);
    expect(job.status).toBe('completed');
  });

  it('should retry a failing job if retriesLeft > 0', () => {
    const job = createPendingEmailJob({ type: 'fail', retriesLeft: 2 });
    queue.addJob(job);

    const processedJob = worker.processNextJob();

    expect(processedJob).toBe(job);
    expect(job.status).toBe('pending');
    expect(job.retriesLeft).toBe(1);
    expect(job.updatedAt.getTime()).toBeGreaterThanOrEqual(job.createdAt.getTime());
  });

  it('should mark failing job as failed if retriesLeft is 0', () => {
    const job = createPendingEmailJob({ type: 'fail', retriesLeft: 0 });
    queue.addJob(job);

    const processedJob = worker.processNextJob();

    expect(processedJob).toBe(job);
    expect(job.status).toBe('failed');
    expect(job.retriesLeft).toBe(0);
  });

  it('should return undefined if no pending job', () => {
    const result = worker.processNextJob();
    expect(result).toBeUndefined();
  });

  it('should process the highest priority job first', () => {
    const low = createPendingEmailJob({ id: 'low', priority: 1 });
    const high = createPendingTaskJob({ id: 'high', priority: 5 });
    queue.addJob(low);
    queue.addJob(high);

    const processedJob = worker.processNextJob();

    expect(processedJob?.id).toBe('high');
    expect(queue.getNextJob()?.id).toBe('low');
  });

  it('should handle job with unknown type gracefully', () => {
    const job = createPendingEmailJob({ type: 'unknown' as any });
    queue.addJob(job);

    const processedJob = worker.processNextJob();

    expect(processedJob).toBe(job);
    expect(job.status).toBe('completed');
  });

  it('should handle failed job with undefined retriesLeft', () => {
    const job = createPendingEmailJob({ type: 'fail', retriesLeft: undefined });
    queue.addJob(job);

    const processedJob = worker.processNextJob();

    expect(processedJob).toBe(job);
    expect(job.status).toBe('failed');
    expect(job.retriesLeft).toBe(0);
  });
});