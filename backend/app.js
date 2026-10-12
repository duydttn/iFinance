'use strict';

const express = require('express');
const initLoaders = require('./loaders');
async function createApp() {
  const app = express();

  const { server, io } = await initLoaders(app);

  return { app, server, io };
}

module.exports = createApp;