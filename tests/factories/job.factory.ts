import { Job } from '../../src/models/job';
import crypto from 'crypto';

export const createJob = (overrides: Partial<Job> = {}): Job => ({
  id: crypto.randomUUID(),
  type: 'email',
  payload: { to: 'test@example.com' },
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createPendingEmailJob = (overrides: Partial<Job> = {}) =>
  createJob({ type: 'email', status: 'pending', ...overrides });

export const createPendingTaskJob = (overrides: Partial<Job> = {}) =>
  createJob({ type: 'task', payload: { taskName: 'Do something' }, status: 'pending', ...overrides });

export const createCompletedJob = (overrides: Partial<Job> = {}) =>
  createJob({ status: 'completed', ...overrides });