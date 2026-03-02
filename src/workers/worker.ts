import { JobQueue } from '../models/jobQueue';
import { Job } from '../models/job';

export class Worker {
  constructor(private queue: JobQueue) {}

  processNextJob(): Job | undefined {
    const job = this.queue.getNextJob();
    if (!job) return undefined;

    try {
      switch (job.type) {
        case 'email':
          console.log(`Sending email to ${job.payload.to}`);
          break;
        case 'task':
          console.log(`Performing task ${job.payload.taskName}`);
          break;
        case 'fail':
          console.log(`Simulating failure for job ${job.id}`);
          throw new Error('Job failed intentionally');
        default:
          console.log(`Unknown job type: ${job.type}`);
      }

      job.status = 'completed';
    } catch (err) {
      job.status = 'failed';
    }

    return job;
  }
}