import { Job } from '../../src/models/job';
import crypto from 'crypto';

export const createJob = (overrides: Partial<Job> = {}): Job => ({
  id: crypto.randomUUID(),
  type: 'email',
  payload: { to: 'test@example.com' },
  status: 'pending',
  retriesLeft: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  priority: 0,
  ...overrides,
});

export const createPendingEmailJob = (overrides: Partial<Job> = {}): Job =>
  createJob({ type: 'email', status: 'pending', retriesLeft: 3, priority: 1, ...overrides });

export const createPendingTaskJob = (overrides: Partial<Job> = {}): Job =>
  createJob({
    type: 'task',
    payload: { taskName: 'Do something' },
    status: 'pending',
    retriesLeft: 2,
    priority: 1,
    ...overrides,
  });

export const createCompletedJob = (overrides: Partial<Job> = {}): Job =>
  createJob({ status: 'completed', retriesLeft: 0, priority: 0, ...overrides });