# Nonce Sense

Nonce Sense is a mining statistics monitoring tool designed to provide real-time updates on mining performance, including worker activity, network difficulty, block height, and BTC price. It also alerts users about significant events such as new best shares, block discoveries, and inactive workers.

## Features

- Fetches and displays live mining statistics.
- Monitors worker activity and alerts if any worker goes offline.
- Tracks and compares the best share against network difficulty.
- Provides BTC price and block height updates.
- Sends notifications for significant mining events:
  - Block discovery.
  - New best share.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nonce_sense.git
   ```
2. Navigate to the project directory:
   ```bash
   cd nonce_sense
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Configure the environment variables in `.env` to match your mining setup.
2. Start the application:
   ```bash
   npm start
   ```
3. The application will fetch and display live mining statistics in the console or send notifications based on configured triggers.

## File Structure

- **`/src/controllers/miningController.ts`**: Contains the main logic for fetching and processing mining statistics.
- **`/src/utils`**: Utility functions for data fetching, formatting, and worker verification.
- **`/src/cfg/env.ts`**: Configuration file for environment-specific settings.

## Environment Variables

Create a `.env` file in root, use `.env.example` as reference.

## Contributing

Contributions are welcome, just branch from `main` open a PR!
