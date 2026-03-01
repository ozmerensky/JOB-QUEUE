import { Job } from '../../../../src/models/job';

/**
 * יוצר Job pending דינמי
 * @param id - מזהה ייחודי ל-job
 */
export const createPendingJob = (id: string = '1'): Job => ({
  id,
  type: 'email',
  payload: { to: 'user@example.com' },
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
});

/**
 * יוצר Job completed דינמי
 * @param id - מזהה ייחודי ל-job
 */
export const createCompletedJob = (id: string = '2'): Job => ({
  ...createPendingJob(id),
  status: 'completed',
});