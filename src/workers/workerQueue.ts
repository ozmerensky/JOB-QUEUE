import { JobQueue } from '../models/jobQueue';
import { Worker } from './worker';

export class WorkerQueue {
  private workers: Worker[] = [];
  private queue: JobQueue;

  constructor(queue: JobQueue, workerCount = 2) {
    this.queue = queue;

    for (let i = 0; i < workerCount; i++) {
      this.workers.push(new Worker(this.queue));
    }
  }

  public runAll(): void {
    for (const worker of this.workers) {
      worker.processNextJob();
    }
  }

  public runUntilEmpty(): void {
    let jobsLeft = this.queue.getAllJobs().some(job => job.status === 'pending');

    while (jobsLeft) {
      this.runAll();
      jobsLeft = this.queue.getAllJobs().some(job => job.status === 'pending');
    }
  }
}