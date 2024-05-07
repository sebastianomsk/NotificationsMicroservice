'use strict';

const _ = require('lodash');
const P = require('bluebird');
const { logger } = require('../../utils');
const errorsHandler = require('./errors');

const defaultOptions = {
    logger: true,
    security: false,
    service: false,
};

class Route {
    constructor (options) {
        this.options = _.defaultsDeep({}, options || {}, defaultOptions);
    }

    handle (req, res, next) {
        return P.bind(this)
            .then(() => this.initialize(req))
            .then(() => this.validate(req, res))
            .then(() => this.authorize(req, res))
            .then(() => this.handler(req, res))
            .then(result => this.success(res, result))
            .catch(error => this.error(error, req, res, next));
    }

    initialize (req) {
        if (this.options.logger) {
            req.logger = logger;

            if (req.service) {
                req.logger.service = req.service;
            }
        }
        // TODO agregar comunicación con otros microservicios
        // if (this.options.service) {
        //     req.service = ...
        // }
        // TODO agregar seguridad
        // if (this.options.security) {
        //     req.security = ...
        // }

        return req;
    }

    validate () {
        return P.resolve();
    }

    authorize () {
        return P.resolve();
    }

    handler () {
        return P.resolve({});
    }

    success (res, result, statusCode = 200) {
        // Handle exceptional cases
        if (result && result.statusCode && result.description === 'already-response') {
            statusCode = result.statusCode;
            result = result.response;
        }
        return res.status(statusCode).send(result);
    }

    error (err, req, res, next) {
        return next(err);
    }

    handlerize () {
        return this.handle.bind(this);
    }
}

Route.errors = errorsHandler;

module.exports = Route;
