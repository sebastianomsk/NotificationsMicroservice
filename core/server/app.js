'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const app = express();

// Middlewares
app.enable('trust proxy');
app.disable('x-powered-by');
app.use(cors());
app.options('*', cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;
