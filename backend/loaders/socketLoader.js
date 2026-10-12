'use strict';

const http = require('http');
const { Server } = require('socket.io');
const config = require('../config');

/**
 * Socket Loader
 * Sets up the HTTP server and Socket.io instance.
 * Attaches 'io' to the app for global access.
 * Returns { server, io } for the main server.
 */
module.exports = function socketLoader(app) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: config.CORS_ORIGINS,
      credentials: true,
    },
  });

  app.set('io', io);

  // We don't initialize services here anymore.
  // Initialization happens in dependencyLoader.js.

  return { server, io };
};