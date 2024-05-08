'use strict';

const _ = require('lodash');
const http = require('http-constants');
const { logger, errors } = require('../../utils');

const statuses = _.values(http.codes);

const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';
const DEFAULT_ERROR_STATUS = http.codes.INTERNAL_SERVER_ERROR;

function handle (app) {
    // Handle 404
    app.use((req, res, next) => {
        res.status(http.codes.NOT_FOUND).send((new errors.NotFound('Not found')).toJson());
    });

    // Handle uncached errors
    app.use((error, req, res, next) => {
        // Log all errors.
        let errorType = '';
        let errorStatus = 0;
        let errorMessage = '';
        let errorStack = '';

        let returnError;

        errorType = (error && error.name) || DEFAULT_ERROR_MESSAGE;
        errorMessage = (error && error.message) || DEFAULT_ERROR_MESSAGE;
        errorStatus = Number((error && (error.status || errors.statusCode || error.responseCode || error.code)) || DEFAULT_ERROR_STATUS);
        // @ts-ignore
        // Check if status is a valid http status code
        errorStatus = statuses.includes(errorStatus) ? errorStatus : DEFAULT_ERROR_STATUS;

        errorStack = (process.env.LOG_ERROR_STACK && error && error.stack) || '';

        logger.error(`[*] ${req.method} ${req.path} - ${errorStatus} ${errorType}. ${errorMessage}`, error.extra ? `\n${JSON.stringify(error.extra)}` : '', errorStack ? `\n${errorStack}` : '');

        // Create CustomError for body.
        if (!returnError) returnError = new errors.CustomError(errorMessage, errorStatus);

        return res.status(errorStatus).send(returnError.toJson());
    });
}

module.exports = handle;
