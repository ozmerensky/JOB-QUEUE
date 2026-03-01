import { Job } from "../../../../src/models/job";

export const pendingEmailJob: Job = {
  id: '101',
  type: 'email',
  payload: { to: 'test@example.com' },
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const pendingTaskJob: Job = {
  id: '102',
  type: 'task',
  payload: { taskName: 'Do something' },
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
};