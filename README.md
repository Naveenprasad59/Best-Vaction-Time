# Best Time For Vacation

This project helps you determine the best time to take a vacation by analyzing holiday data and suggesting optimal vacation periods.

## Features
- Fetches holiday data from a specified API
- Groups holidays that occur sequentially
- Bridges holidays with leave days to maximize vacation time

## Prerequisites
- Node.js (v14 or higher recommended)
- npm
- TypeScript

## Installation

1. Clone the repository or download the source code.
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Ensure your environment variables are set up if required (see `.env.example`).
2. Start the server:
   ```bash
   npm start
   ```
3. The server will run and process holiday data as defined in `server.js`.

## Project Structure
- `server.js` - Main JavaScript source code (logic for fetching and processing holidays)
- `package.json` - Project dependencies and scripts

## Dependencies
- [dayjs](https://www.npmjs.com/package/dayjs) - Date/time manipulation
- [node-fetch](https://www.npmjs.com/package/node-fetch) - HTTP requests
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variable management

## License
ISC

---
Feel free to contribute or open issues to improve the project!
