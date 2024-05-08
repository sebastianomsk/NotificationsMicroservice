'use strict';

const morgan = require('morgan');

const stream = require('../../utils/logger');

const morganOptions = {
    stream
};

const morganMiddleware = morgan('[*] :method :url :status :res[content-length] - :response-time ms', morganOptions);

module.exports = morganMiddleware;
