import { Job } from './job';

export class JobQueue {
  private queue: Job[] = [];

  addJob(job: Job) {
    this.queue.push(job);
  }

  getNextJob(): Job | undefined {
    const pendingJobs = this.queue.filter(job => job.status === 'pending');
    if (pendingJobs.length === 0) return undefined;

    return pendingJobs.reduce((highest, current) => {
      const highestPriority = highest.priority ?? 0;
      const currentPriority = current.priority ?? 0;
      return currentPriority > highestPriority ? current : highest;
    });
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