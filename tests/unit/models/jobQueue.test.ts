import { JobQueue } from '../../../src/models/jobQueue';
import { createPendingJob, createCompletedJob } from './mockes/jobs';

describe('JobQueue', () => {
  let queue: JobQueue;

  beforeEach(() => {
    queue = new JobQueue();
  });

  it('should add a job', () => {
    const job = createPendingJob();
    queue.addJob(job);
    expect(queue.getAllJobs()).toContain(job);
  });

  it('should get next pending job', () => {
    const job1 = createPendingJob('1');
    const job2 = createCompletedJob('2');
    queue.addJob(job1);
    queue.addJob(job2);
    const nextJob = queue.getNextJob();
    expect(nextJob).toBe(job1);
  });

  it('should update job status', () => {
    const job = createPendingJob('1');
    queue.addJob(job);
    queue.updateJobStatus(job.id, 'completed');
    expect(queue.getNextJob()).toBeUndefined();
    expect(queue.getAllJobs()[0].status).toBe('completed');
  });
});