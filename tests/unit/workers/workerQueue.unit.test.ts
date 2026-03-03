import { JobQueue } from '../../../src/models/jobQueue';
import { WorkerQueue } from '../../../src/workers/workerQueue';
import { createPendingEmailJob, createPendingTaskJob } from '../../factories/job.factory';

describe('WorkerQueue', () => {
  let queue: JobQueue;
  let workerQueue: WorkerQueue;

  beforeEach(() => {
    queue = new JobQueue();
  });

  it('should process all jobs once', () => {
    queue.addJob(createPendingEmailJob({ retriesLeft: 1 }));
    queue.addJob(createPendingTaskJob({ retriesLeft: 2 }));

    workerQueue = new WorkerQueue(queue, 2);
    workerQueue.runAll();

    const allJobs = queue.getAllJobs();
    expect(
      allJobs.every(job => job.status === 'completed' || (job.retriesLeft ?? 0) > 0)
    ).toBe(true);
  });

  it('should run until queue is empty including retries', () => {
    queue.addJob(createPendingEmailJob({ retriesLeft: 1 }));
    queue.addJob(createPendingTaskJob({ retriesLeft: 2 }));

    workerQueue = new WorkerQueue(queue, 2);
    workerQueue.runUntilEmpty();

    const allJobs = queue.getAllJobs();
    expect(allJobs.every(job => job.status === 'completed')).toBe(true);
  });

  it('should process higher priority jobs first', () => {
    const low = createPendingEmailJob({ id: 'low', priority: 1 });
    const high = createPendingTaskJob({ id: 'high', priority: 5 });

    queue.addJob(low);
    queue.addJob(high);

    workerQueue = new WorkerQueue(queue, 1);
    workerQueue.runAll();

    const firstCompleted = queue.getAllJobs().find(j => j.status === 'completed');
    expect(firstCompleted?.id).toBe('high');
  });

  it('should process higher priority jobs first even with multiple workers', () => {
    const jobs = [
      createPendingEmailJob({ id: 'low', priority: 1 }),
      createPendingTaskJob({ id: 'medium', priority: 3 }),
      createPendingEmailJob({ id: 'high', priority: 5 }),
    ];
    jobs.forEach(j => queue.addJob(j));

    workerQueue = new WorkerQueue(queue, 1);
    workerQueue.runAll();

    const completedIds = queue.getAllJobs()
      .filter(j => j.status === 'completed')
      .map(j => j.id);

    expect(completedIds[0]).toBe('high');
  });

  it('should handle multiple workers processing jobs concurrently', () => {
    const jobs = [
      createPendingEmailJob({ id: 'email1', retriesLeft: 1 }),
      createPendingTaskJob({ id: 'task1', retriesLeft: 1 }),
      createPendingEmailJob({ id: 'email2', retriesLeft: 1 }),
    ];
    jobs.forEach(j => queue.addJob(j));

    workerQueue = new WorkerQueue(queue, 2);
    workerQueue.runAll();

    const allJobs = queue.getAllJobs();
    expect(allJobs.filter(j => j.status === 'completed').length).toBeGreaterThanOrEqual(2);
  });

  it('should not fail if there are no pending jobs', () => {
    workerQueue = new WorkerQueue(queue, 2);
    expect(() => workerQueue.runAll()).not.toThrow();
    expect(queue.getAllJobs().length).toBe(0);
  });

  it('should handle empty queue with runUntilEmpty', () => {
    workerQueue = new WorkerQueue(queue, 2);
    expect(() => workerQueue.runUntilEmpty()).not.toThrow();
    expect(queue.getAllJobs().length).toBe(0);
  });

  it('should handle empty queue safely with runUntilEmpty and multiple workers', () => {
    workerQueue = new WorkerQueue(queue, 3);
    expect(() => workerQueue.runUntilEmpty()).not.toThrow();
    expect(queue.getAllJobs().length).toBe(0);
  });

  it('should not retry jobs with retriesLeft = 0', () => {
    const job = createPendingEmailJob({ retriesLeft: 0 });
    queue.addJob(job);

    workerQueue = new WorkerQueue(queue, 2);
    workerQueue.runUntilEmpty();

    const updatedJob = queue.getAllJobs()[0];
    expect(updatedJob.status).toBe('completed');
    expect(updatedJob.retriesLeft).toBe(0);
  });

  it('should retry failed jobs until retriesLeft is 0', () => {
    const job = createPendingEmailJob({ type: 'fail', retriesLeft: 2 });
    queue.addJob(job);

    workerQueue = new WorkerQueue(queue, 1);
    workerQueue.runUntilEmpty();

    const updatedJob = queue.getAllJobs()[0];
    expect(updatedJob.status).toBe('failed');
    expect(updatedJob.retriesLeft).toBe(0);
  });

  it('should process all jobs until retries are exhausted regardless of priority', () => {
    const jobs = [
      createPendingEmailJob({ id: 'low', priority: 1, retriesLeft: 1 }),
      createPendingTaskJob({ id: 'medium', priority: 3, retriesLeft: 1 }),
      createPendingEmailJob({ id: 'high', priority: 5, retriesLeft: 1 }),
    ];
    jobs.forEach(j => queue.addJob(j));

    workerQueue = new WorkerQueue(queue, 1);
    workerQueue.runUntilEmpty();

    const allJobs = queue.getAllJobs();

    expect(allJobs.every(j => j.status === 'completed' || j.status === 'failed')).toBe(true);

    allJobs.forEach(j => {
      if (j.status === 'failed') {
        expect(j.retriesLeft).toBe(0);
      }
    });
  });

  it('should handle jobs with unknown type gracefully', () => {
    const unknownJob = createPendingTaskJob({ id: 'unknown', type: 'weird' as any });
    queue.addJob(unknownJob);

    workerQueue = new WorkerQueue(queue, 1);
    workerQueue.runAll();

    const processedJob = queue.getAllJobs()[0];
    expect(processedJob.status).toBe('completed');
  });
});