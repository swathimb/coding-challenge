// const express = require('express');
import express from "express";
import webpack from 'webpack';
import historyApiFallback from 'connect-history-api-fallback';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config.js';
import apiRoutes from './api/index.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const compiler = webpack(config);
const app = express();
const port = process.env.PORT || 3000;
// use any express routes (fallback should be defined in each route file)
app.use('/api', apiRoutes);

// if not found in routes, use history fallback api
// (redirect to browser so react-router can pick it up)
app.use(historyApiFallback());

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
app.use(webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.listen(port, function () {
  console.log(`express listening on port ${port}\n`);
});