'use strict';

const http = require('http-constants');
const CustomError = require('./custom');

class NotFound extends CustomError {
    constructor (message = 'Not Found', extra) {
        super(message, http.codes.NOT_FOUND, extra);
    }
}

class BadRequest extends CustomError {
    constructor (message = 'Bad Request', extra) {
        super(message, http.codes.BAD_REQUEST, extra);
    }
}

class Conflict extends CustomError {
    constructor (message = 'Conflict', extra) {
        super(message, http.codes.CONFLICT, extra);
    }
}

module.exports = {
    NotFound,
    BadRequest,
    Conflict,
    CustomError
};
