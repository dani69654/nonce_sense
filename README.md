# Nonce Sense

Nonce Sense is a comprehensive Bitcoin mining statistics monitoring tool built with TypeScript and Node.js. It provides real-time monitoring of mining operations through a web server and Telegram bot integration, offering detailed insights into worker performance, network metrics, and market data.

## 🚀 Features

### Core Monitoring

- **Real-time Mining Statistics**: Fetches live data from CKPool solo mining pool
- **Worker Activity Monitoring**: Tracks individual worker performance and alerts on offline workers
- **Network Metrics**: Monitors Bitcoin network difficulty and block height
- **Market Data Integration**: Real-time BTC price, Fear & Greed Index, and Bitcoin ETF data

### Smart Notifications

- **Block Discovery Alerts**: Instant notifications when a block is found
- **Best Share Tracking**: Alerts for new personal best shares
- **Worker Status Alerts**: Notifications when workers go offline
- **Performance Comparisons**: Shows best share percentage against network difficulty

### Telegram Bot Integration

- **Interactive Commands**: `/stats` command with inline keyboard for worker selection
- **Individual Worker Stats**: Detailed performance metrics per worker
- **Aggregated Statistics**: Combined data from all workers
- **Markdown Formatting**: Rich text formatting for better readability

### Web Server Features

- **Express.js Server**: RESTful API endpoints
- **Heartbeat Monitoring**: Health check endpoint for uptime monitoring
- **Scheduled Tasks**: Automated statistics reporting via setInterval

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js
- **Build Tool**: esbuild for production builds
- **Telegram Integration**: node-telegram-bot-api
- **Scheduling**: Native setInterval
- **HTTP Client**: Native fetch API
- **Data Sources**: CKPool, Blockchain.info, Coinpaprika, Alternative.me

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/nonce_sense.git
   cd nonce_sense
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   WORKERS=[{"name":"Worker1","address":"your_btc_address_1"},{"name":"Worker2","address":"your_btc_address_2"}]
   TG_TOKEN=your_telegram_bot_token
   CHAT_ID=your_telegram_chat_id
   SERVER_URL=http://localhost:3000
   ```

## 🔧 Build Process

### Development Build

```bash
npm run dev
```

- Uses `nodemon` with `ts-node` for hot reloading
- Direct TypeScript execution without compilation
- Ideal for development and debugging

### Production Build

```bash
npm run build:prod
```

- Uses **esbuild** for fast bundling and minification
- Targets Node.js 20 runtime
- Bundles all dependencies except external ones (express, node-telegram-bot-api)
- Outputs optimized single file to `dist/index.js`
- Includes minification for smaller bundle size

### Production Start

```bash
npm start
```

- Runs production build followed by the compiled application
- Optimized for deployment environments

## 🏗️ Project Structure

```
src/
├── controllers/           # Business logic controllers
│   ├── miningController.ts    # Mining statistics processing
│   └── telegramController.ts  # Telegram bot interactions
├── utils/                # Utility functions
│   ├── beat.ts              # Heartbeat monitoring
│   ├── data.ts              # Data fetching from external APIs
│   ├── format.ts            # Number and currency formatting
│   └── workers.ts           # Worker data processing
├── cfg/                  # Configuration
│   ├── env.ts              # Environment variables
│   └── telegram.ts         # Telegram bot setup
├── routes/               # Express routes
│   └── index.ts            # API endpoints
├── types.ts              # TypeScript type definitions
└── index.ts              # Application entry point
```

## 🔌 API Endpoints

### Health Check

- **GET** `/heartbeat` - Returns server health status
- Used for uptime monitoring and load balancer health checks

## 📊 Data Sources

### Mining Data

- **CKPool Solo Mining**: `https://eusolo.ckpool.org/users/{address}`
- Fetches worker statistics, hashrates, and share information

### Network Data

- **Blockchain.info**: Network difficulty and block height
- **Coinpaprika**: Real-time BTC/USD price
- **Alternative.me**: Fear & Greed Index
- **Bitcoin ETF Data**: ETF flow information

## 🎯 Key Features Explained

### Worker Monitoring

The system monitors multiple Bitcoin mining workers by:

- Fetching individual worker data from CKPool
- Aggregating hashrates across all workers
- Tracking best shares and comparing against network difficulty
- Detecting offline workers and sending alerts

### Smart Notifications

- **Block Found**: Triggers when best share ≥ network difficulty
- **New Best Share**: Alerts when personal best share improves
- **Worker Offline**: Notifies when any worker stops reporting

### Telegram Bot Commands

- `/stats` - Shows interactive menu with worker options
- **ALL** - Displays aggregated statistics from all workers
- **Individual Workers** - Shows detailed stats for specific workers

## 🔧 Configuration

### Environment Variables

| Variable     | Type       | Description              | Example                                   |
| ------------ | ---------- | ------------------------ | ----------------------------------------- |
| `PORT`       | number     | Web server port          | `3000`                                    |
| `WORKERS`    | JSON array | Worker configurations    | `[{"name":"Worker1","address":"bc1..."}]` |
| `TG_TOKEN`   | string     | Telegram bot token       | `1234567890:ABC...`                       |
| `CHAT_ID`    | string     | Telegram chat ID         | `-1001234567890`                          |
| `SERVER_URL` | string     | Server URL for heartbeat | `http://localhost:3000`                   |

### Worker Configuration Format

```json
[
  {
    "name": "Worker Name",
    "address": "Bitcoin Address"
  }
]
```

## 🚀 Deployment

### Local Development

```bash
npm run dev
```

### Production Deployment

```bash
npm start
```

### Docker Deployment (Recommended)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 📈 Monitoring

### Health Checks

- Heartbeat endpoint for uptime monitoring
- Automatic error logging and recovery
- Graceful handling of API failures

### Performance Metrics

- Real-time hashrate monitoring
- Share difficulty tracking
- Network difficulty comparison
- Market sentiment analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style and formatting
- Add appropriate error handling
- Test thoroughly before submitting PRs

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:

1. Check existing issues in the repository
2. Create a new issue with detailed information
3. Include logs and configuration details when reporting bugs

---

**Built with ❤️ for the Bitcoin mining community**
