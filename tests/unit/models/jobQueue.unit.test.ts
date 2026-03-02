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

  // ✅ בדיקה ש-job שמסומן כ-failed עם retriesLeft > 0 חוזר ל-pending ומקטין retriesLeft
  it('should decrement retriesLeft when a job fails', () => {
    const job = createPendingEmailJob({ retriesLeft: 2 });
    queue.addJob(job);

    queue.updateJobStatus(job.id, 'failed');

    const updatedJob = queue.getAllJobs()[0];
    expect(updatedJob.status).toBe('pending');
    expect(updatedJob.retriesLeft).toBe(1);
  });

  // ✅ בדיקה ש-job שמגיע ל-0 retries מסומן כ-failed
  it('should mark job as failed when retriesLeft reaches 0', () => {
    const job = createPendingEmailJob({ retriesLeft: 1 });
    queue.addJob(job);

    queue.updateJobStatus(job.id, 'failed');

    const updatedJob = queue.getAllJobs()[0];
    expect(updatedJob.status).toBe('failed');
    expect(updatedJob.retriesLeft).toBe(0);
  });
});