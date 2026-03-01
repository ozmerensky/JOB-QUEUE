import { Job } from "../../../../src/models/job";

export const createPendingEmailJob = (id: string = '101'): Job => ({
  id,
  type: 'email',
  payload: { to: 'test@example.com' },
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const createPendingTaskJob = (id: string = '102'): Job => ({
  id,
  type: 'task',
  payload: { taskName: 'Do something' },
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
});