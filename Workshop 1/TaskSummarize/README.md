# TaskSummarize

A full-stack application with a React frontend and Node.js backend for task summarization.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd TaskSummarize
```

2. Install dependencies:
```bash
npm install
```
This will automatically install dependencies for both client and server using the postinstall script.

## Running the Application

You can start both the client and server simultaneously using:
```bash
npm start
```

This will launch:
- Frontend client at http://localhost:5173
- Backend server at http://localhost:3000

### Running Components Separately

If you need to run the frontend or backend separately:

For the client only:
```bash
npm run client
```

For the server only:
```bash
npm run server
```

## Development

### Client (Frontend)
- Built with React + TypeScript
- Uses Vite as the build tool
- Includes TailwindCSS for styling
- Located in the `/client` directory

### Server (Backend)
- Node.js backend
- Express.js framework
- Located in the `/server` directory
- Configuration files in `/server/config`
- API routes in `/server/routes`
- Database models in `/server/models`

## Debugging

To run the application in debug mode:
```bash
npm run debug
```
This will start the client normally and the server with the Node.js inspector enabled on port 9229.

## Environment Variables

The server requires certain environment variables to be set in `/server/.env`. Make sure this file exists and contains the necessary configurations.

## Project Structure
```
TaskSummarize/
├── client/             # Frontend React application
│   ├── src/           # Source code
│   └── public/        # Static files
├── server/            # Backend Node.js application
│   ├── config/        # Configuration files
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── utils/         # Utility functions
└── package.json       # Project configuration and scripts
```

## Available Scripts

- `npm install` - Install all dependencies (client + server)
- `npm start` - Start both client and server
- `npm run client` - Start client only
- `npm run server` - Start server only
- `npm run debug` - Start in debug mode