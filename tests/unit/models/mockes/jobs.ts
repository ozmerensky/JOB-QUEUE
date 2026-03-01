import { Job } from '../../../../src/models/job';

export const createPendingJob = (id: string = '1'): Job => ({
  id,
  type: 'email',
  payload: { to: 'user@example.com' },
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const createCompletedJob = (id: string = '2'): Job => ({
  ...createPendingJob(id),
  status: 'completed',
});