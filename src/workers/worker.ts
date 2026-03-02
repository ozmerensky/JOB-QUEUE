import { JobQueue } from '../models/jobQueue';
import { Job } from '../models/job';

export class Worker {
  private queue: JobQueue;

  constructor(queue: JobQueue) {
    this.queue = queue;
  }

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
          throw new Error('Simulated failure');

        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }

      // ✅ worker רק מדווח הצלחה
      this.queue.updateJobStatus(job.id, 'completed');

    } catch (err) {
      // ✅ worker רק מדווח failure
      this.queue.updateJobStatus(job.id, 'failed');
    }

    return job;
  }
}
