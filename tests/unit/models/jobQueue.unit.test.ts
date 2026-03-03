import { JobQueue } from '../../../src/models/jobQueue';
import { createPendingEmailJob, createPendingTaskJob, createCompletedJob } from '../../factories/job.factory';

describe('JobQueue', () => {
  let queue: JobQueue;

  beforeEach(() => {
    queue = new JobQueue();
  });

  it('should add a job', () => {
    const job = createPendingEmailJob();
    queue.addJob(job);
    expect(queue.getAllJobs()).toContain(job);
  });

  it('should get next pending job', () => {
    const job1 = createPendingEmailJob();
    const job2 = createCompletedJob();
    queue.addJob(job1);
    queue.addJob(job2);
    const nextJob = queue.getNextJob();
    expect(nextJob).toBe(job1);
  });

  it('should get the pending job with the highest priority', () => {
    const low = createPendingEmailJob({ id: 'low', priority: 1 });
    const high = createPendingTaskJob({ id: 'high', priority: 5 });
    queue.addJob(low);
    queue.addJob(high);
    const next = queue.getNextJob();
    expect(next?.id).toBe('high');
  });

  it('should respect FIFO when multiple jobs have same priority', () => {
    const job1 = createPendingEmailJob({ id: 'first', priority: 3 });
    const job2 = createPendingTaskJob({ id: 'second', priority: 3 });
    queue.addJob(job1);
    queue.addJob(job2);
    const next = queue.getNextJob();
    expect(next?.id).toBe('first');
  });

  it('should return undefined when no pending jobs', () => {
    expect(queue.getNextJob()).toBeUndefined();
  });

  it('should update job status', () => {
    const job = createPendingEmailJob();
    queue.addJob(job);
    queue.updateJobStatus(job.id, 'completed');
    expect(queue.getNextJob()).toBeUndefined();
    expect(queue.getAllJobs()[0].status).toBe('completed');
  });

  it('should decrement retriesLeft when a job fails', () => {
    const job = createPendingEmailJob({ retriesLeft: 2 });
    queue.addJob(job);
    queue.updateJobStatus(job.id, 'failed');
    const updatedJob = queue.getAllJobs()[0];
    expect(updatedJob.status).toBe('pending');
    expect(updatedJob.retriesLeft).toBe(1);
  });

  it('should mark job as failed when retriesLeft reaches 0', () => {
    const job = createPendingEmailJob({ retriesLeft: 1 });
    queue.addJob(job);
    queue.updateJobStatus(job.id, 'failed');
    const updatedJob = queue.getAllJobs()[0];
    expect(updatedJob.status).toBe('failed');
    expect(updatedJob.retriesLeft).toBe(0);
  });

  it('should do nothing if jobId does not exist', () => {
    queue.updateJobStatus('non-existent-id', 'completed');
    expect(queue.getAllJobs().length).toBe(0);
  });

  it('should handle failed job with undefined retriesLeft', () => {
    const job = createPendingEmailJob({ retriesLeft: undefined, status: 'pending' });
    queue.addJob(job);
    queue.updateJobStatus(job.id, 'failed');
    const updatedJob = queue.getAllJobs()[0];
    expect(updatedJob.status).toBe('failed');
    expect(updatedJob.retriesLeft).toBe(0);
  });
});