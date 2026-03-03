import { connectDB, clearDB, closeDB } from '../setup';
import { JobQueue } from '../../../src/models/jobQueue';
import { WorkerQueue } from '../../../src/workers/workerQueue';
import { createJob } from '../../factories/job.factory';

describe('WorkerQueue Integration with retries and priorities', () => {
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
    workerQueue = new WorkerQueue(jobQueue, 2);
  });

  it('should process a single email job successfully', () => {
    const job = createJob({ type: 'email', retriesLeft: 2 });
    jobQueue.addJob(job);

    workerQueue.runUntilEmpty();

    const jobs = jobQueue.getAllJobs();
    expect(jobs.length).toBe(1);
    expect(jobs[0].status).toBe('completed');
    expect(jobs[0].retriesLeft).toBe(2);
  });

  it('should retry a failing job until retries are exhausted', () => {
    const job = createJob({ type: 'fail', retriesLeft: 2 });
    jobQueue.addJob(job);

    workerQueue.runUntilEmpty();

    const updatedJob = jobQueue.getAllJobs()[0];
    expect(updatedJob.status).toBe('failed');
    expect(updatedJob.retriesLeft).toBe(0);
  });

  it('should mark failing job as failed if retriesLeft is 0', () => {
    const job = createJob({ type: 'fail', retriesLeft: 0 });
    jobQueue.addJob(job);

    workerQueue.runUntilEmpty();

    const updatedJob = jobQueue.getAllJobs()[0];
    expect(updatedJob.status).toBe('failed');
    expect(updatedJob.retriesLeft).toBe(0);
  });

  it('should process multiple jobs with retries correctly', () => {
    const jobs = [
      createJob({ type: 'email', retriesLeft: 2 }),
      createJob({ type: 'fail', retriesLeft: 1 }),
      createJob({ type: 'task', retriesLeft: 2 }),
    ];

    jobs.forEach(j => jobQueue.addJob(j));

    workerQueue.runUntilEmpty();

    const all = jobQueue.getAllJobs();

    expect(all.find(j => j.type === 'email')?.status).toBe('completed');
    expect(all.find(j => j.type === 'task')?.status).toBe('completed');

    const failJob = all.find(j => j.type === 'fail');
    expect(failJob?.status).toBe('failed');
    expect(failJob?.retriesLeft).toBe(0);
  });

  it('should process higher priority jobs first', () => {
    const low = createJob({ type: 'email', retriesLeft: 1, priority: 1 });
    const high = createJob({ type: 'task', retriesLeft: 1, priority: 5 });
    jobQueue.addJob(low);
    jobQueue.addJob(high);

    const nextJob = workerQueue['workers'][0].processNextJob();

    expect(nextJob?.id).toBe(high.id);
    expect(nextJob?.status).toBe('completed');
  });
});