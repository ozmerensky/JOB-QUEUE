import { Job } from './job';

export class JobQueue {
  private queue: Job[] = [];

  addJob(job: Job) {
    this.queue.push(job);
  }

  getNextJob(): Job | undefined {
    return this.queue.find(job => job.status === 'pending');
  }

  updateJobStatus(jobId: string, status: Job['status']) {
    const job = this.queue.find(j => j.id === jobId);
    if (!job) return;

    if (status === 'completed') {
      job.status = 'completed';
    }

    if (status === 'failed') {
      if ((job.retriesLeft ?? 0) > 0) {
        job.retriesLeft!--;

        // 🔥 הכי חשוב – בדיקה אחרי decrement
        if (job.retriesLeft > 0) {
          job.status = 'pending';
        } else {
          job.status = 'failed';
        }
      } else {
        job.retriesLeft = 0;
        job.status = 'failed';
      }
    }

    job.updatedAt = new Date();
  }

  getAllJobs(): Job[] {
    return this.queue;
  }
}



