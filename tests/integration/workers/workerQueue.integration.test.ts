import { connectDB, clearDB, closeDB } from '../setup';
import { JobQueue } from '../../../src/models/jobQueue';
import { WorkerQueue } from '../../../src/workers/workerQueue';
import { createJob } from '../../factories/job.factory';

describe('WorkerQueue Integration', () => {
  let jobQueue: JobQueue;
  let workerQueue: WorkerQueue;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
    jobQueue = new JobQueue();
    workerQueue = new WorkerQueue(jobQueue);
  });

  it('should process a single email job', () => {
    const job = createJob({ type: 'email' });
    jobQueue.addJob(job);

    workerQueue.runUntilEmpty();

    const jobs = jobQueue.getAllJobs();
    expect(jobs.length).toBe(1);
    expect(jobs[0].status).toBe('completed');
  });

  it('should mark job as failed when type is fail', () => {
    const job = createJob({ type: 'fail' });
    jobQueue.addJob(job);

    workerQueue.runUntilEmpty();

    const jobs = jobQueue.getAllJobs();
    expect(jobs[0].status).toBe('failed');
  });

  it('should process multiple jobs', () => {
    const jobs = [
      createJob({ type: 'email' }),
      createJob({ type: 'task' }),
      createJob({ type: 'email' }),
    ];

    jobs.forEach(j => jobQueue.addJob(j));

    workerQueue.runUntilEmpty();

    const all = jobQueue.getAllJobs();
    expect(all.every(j => j.status === 'completed' || j.type === 'fail')).toBe(true);
  });
});