# Job Queue System

A job queue system that manages and processes tasks efficiently with priority-based execution and automatic retry capabilities.

## License

MIT License (see LICENSE in this repository)

## Repository Structure

| Folder / File         | Description                                        |
|-----------------------|----------------------------------------------------|
| src/models/           | Job and JobQueue data models                       |
| src/workers/          | Worker and WorkerQueue classes                     |
| tests/                | Unit and integration tests                         |
| package.json          | Project dependencies and scripts                   |
| jest.config.js        | Jest testing configuration                         |


## Technical Decisions & Strategy

-   **Priority-Queue Architecture:** I implemented a custom priority-based scheduling logic. This ensures that critical tasks are processed first, moving beyond simple FIFO (First-In-First-Out) behavior to meet real-world business SLA requirements.
-   **State Machine Management:** The system follows a strict State Machine pattern for job lifecycles (`pending` -> `completed` / `failed`). This guarantees data integrity and prevents jobs from being processed multiple times or getting stuck in undefined states.
-   **Resiliency with Automatic Retries:** To handle transient failures, I built an integrated retry mechanism. The logic intelligently decrements retry counts and manages state transitions, ensuring the system can self-heal before marking a job as permanently failed.
-   **Worker Orchestration:** The `WorkerQueue` was designed to manage multiple worker instances. This decoupling of the queue storage from the processing logic allows for easy horizontal scaling and parallel execution.
-   **Test-Driven Reliability (98% Coverage):** By using **Jest** and **mongodb-memory-server**, I ensured that the entire business logic is validated in an isolated, high-speed environment. The high coverage metric (35 tests) reflects a "zero-leak" policy where every edge case, including priority ties and exhausted retries, is verified.
-   **TypeScript for Domain Integrity:** Leveraging TypeScript interfaces for Job models ensured that the contract between the Queue and the Workers is type-safe, significantly reducing runtime errors during complex state transitions.


## Quick Start

Clone the repository:

```bash
git clone https://github.com/ozmerensky/JOB-QUEUE.git
cd job-queue
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run tests:

   ```bash
   npm test
   ```

## Features

- Priority-Based Processing: Tasks are executed based on priority levels
- Automatic Retries: Failed tasks can be automatically retried
- Multiple Worker Support: Multiple workers can process tasks in parallel
- Job Status Tracking: Keep track of task states (pending, completed, failed)
- In-Memory Storage: Uses in-memory MongoDB for fast, CI-friendly testing

## Testing

This project includes comprehensive test coverage:

- Unit Tests: Individual components tested in isolation
- Integration Tests: Complete workflows tested
- High Coverage: ~98% code coverage (35 tests)
- In-Memory Database: No external setup required

Run tests:

```bash
npm test
```

## CI (Continuous Integration)

GitHub Actions automatically test and validate every code change:

- Automated testing on push and pull requests
- Coverage reporting included
- Runs on Node.js 18
- Failing tests prevent merging to main branch

## Important Files

- `src/models/jobQueue.ts` — Job queue management and storage
- `src/workers/worker.ts` — Individual job processing logic
- `src/workers/workerQueue.ts` — Worker orchestration and management
- `tests/` — Unit and integration test files

## Notes

- Built with TypeScript for type safety
- Uses Jest for testing framework
- In-memory MongoDB for testing (no external database needed)
- Designed for automation engineering workflows
