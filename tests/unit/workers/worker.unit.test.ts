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

  // ✅ בדיקה שהוורקר מעבד job מסוג email ומסמן אותו כ-completed
  it('should process a single email job', () => {
    const pendingEmailJob = createPendingEmailJob();
    queue.addJob(pendingEmailJob);
    const job = worker.processNextJob();

    expect(job).toBe(pendingEmailJob);
    expect(queue.getAllJobs()[0].status).toBe('completed');
  });

  // ✅ בדיקה שהוורקר מנסה retry כאשר job נכשל ויש retriesLeft
  it('should retry a failing job if retriesLeft > 0', () => {
    const job = createPendingEmailJob({ type: 'fail', retriesLeft: 2 });
    queue.addJob(job);

    worker.processNextJob();

    const updatedJob = queue.getAllJobs()[0];
    expect(updatedJob.status).toBe('pending');
    expect(updatedJob.retriesLeft).toBe(1);
  });

  // ✅ בדיקה שהוורקר מסמן job כ-failed כאשר אין retriesLeft
  it('should mark failing job as failed if retriesLeft is 0', () => {
    const job = createPendingEmailJob({ type: 'fail', retriesLeft: 0 });
    queue.addJob(job);

    worker.processNextJob();

    const updatedJob = queue.getAllJobs()[0];
    expect(updatedJob.status).toBe('failed');
  });

  // ✅ בדיקה שהוורקר מחזיר undefined כאשר אין job ממתין
  it('should return undefined if no pending job', () => {
    const result = worker.processNextJob();
    expect(result).toBeUndefined();
  });
});
