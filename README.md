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

3. Start the system:

   ```bash
   npm start
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
