import { JobQueue } from '../../../src/models/jobQueue';
import { createPendingEmailJob, createCompletedJob } from '../../factories/job.factory';

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

  it('should update job status', () => {
    const job = createPendingEmailJob();
    queue.addJob(job);
    queue.updateJobStatus(job.id, 'completed');
    expect(queue.getNextJob()).toBeUndefined();
    expect(queue.getAllJobs()[0].status).toBe('completed');
  });
});