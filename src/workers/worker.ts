import { JobQueue } from '../models/jobQueue';
import { Job } from '../models/job';

export class Worker {
  private queue: JobQueue;

  constructor(queue: JobQueue) {
    this.queue = queue;
  }

  public processNextJob(): Job | undefined {
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
        default:
          console.log(`Unknown job type: ${job.type}`);
      }

      this.queue.updateJobStatus(job.id, 'completed');
      return job;
    } catch (err) {
      console.error(`Failed to process job ${job.id}:`, err);
      return undefined;
    }
  }
}
