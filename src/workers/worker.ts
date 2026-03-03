import { JobQueue } from '../models/jobQueue';
import { Job } from '../models/job';

export class Worker {
  constructor(private queue: JobQueue) {}

  processNextJob(): Job | undefined {
    const job = this.queue.getNextJob();
    if (!job) return undefined;

    switch (job.type) {
      case 'email':
        console.log(`Sending email to ${job.payload?.to || 'unknown'}`);
        job.status = 'completed';
        job.updatedAt = new Date();
        break;

      case 'task':
        console.log(`Performing task ${job.payload?.description || 'Do something'}`);
        job.status = 'completed';
        job.updatedAt = new Date();
        break;

      case 'fail':
        console.log(`Simulating failure for job ${job.id}`);
        if ((job.retriesLeft ?? 0) > 0) {
          job.retriesLeft!--;
          job.status = 'pending';
        } else {
          job.status = 'failed';
          job.retriesLeft = 0;
        }
        job.updatedAt = new Date();
        break;

      default:
        console.log(`Unknown job type ${job.type}, marking as completed`);
        job.status = 'completed';
        job.updatedAt = new Date();
        break;
    }

    this.queue.updateJobStatus(job.id, job.status);

    return job;
  }
}