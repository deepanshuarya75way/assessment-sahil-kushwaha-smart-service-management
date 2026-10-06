const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const app = require('./app');
const connectDB = require('./config/db');

const http =require('http');
const {initRealTime }= require ('./services/realtimeService'); 

const PORT = process.env.PORT || 5001;

// Connect to MongoDB Database and then start Server
const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    initRealTime(server);
    server.listen(PORT, () => {
      console.log(`[Server] Smart Service Management backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection] Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error(`[Server Startup Failed] Error: ${err.message}`);
    process.exit(1);
  }
};

startServer();
