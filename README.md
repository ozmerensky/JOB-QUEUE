# Job Queue

A job queue system that manages and processes tasks efficiently with priority-based execution and automatic retry capabilities.

## Features

- **Priority-Based Processing**: Tasks are executed based on priority levels, ensuring important work gets done first
- **Automatic Retries**: Failed tasks can be automatically retried without manual intervention
- **Multiple Worker Support**: Multiple workers can process tasks in parallel for better throughput
- **Job Status Tracking**: Keep track of task states including pending, completed, and failed
- **Reliable**: Thoroughly tested to ensure consistent and dependable operation

## Installation

### Requirements

- Node.js 18 or newer
- npm or yarn package manager

### Setup Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd job-queue
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

That's it! You're ready to go.

## Testing

This project includes comprehensive test coverage to ensure reliability:

- **Unit Tests**: Individual components are tested in isolation to verify they work correctly
- **Integration Tests**: Complete workflows are tested to ensure all parts work together properly
- **High Coverage**: Most of the codebase is covered by tests, catching bugs early (35 tests, ~98% coverage)
- **In-Memory Database**: Tests use a temporary in-memory database, so no external setup is needed

The extensive testing ensures the system works as expected and handles edge cases properly.

## Continuous Integration (CI)

This project uses GitHub Actions to automatically test and validate every code change:

- **Automated Testing**: Tests run automatically on every push and pull request
- **Coverage Reporting**: Test coverage is measured and recorded with each run
- **Node.js 18**: Tests run on Node.js 18 to ensure compatibility
- **Quality Assurance**: Failed tests prevent code from being merged, maintaining code quality

The CI workflow ensures code reliability and catches issues early in the development process.

## License

MIT
