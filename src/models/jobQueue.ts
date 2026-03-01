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
    if (job) {
      job.status = status;
      job.updatedAt = new Date();
    }
  }

  getAllJobs(): Job[] {
    return this.queue;
  }
}