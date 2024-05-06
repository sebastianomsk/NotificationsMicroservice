'use strict';

/**
 * @api {post} /notifications Create Notification.
 * @apiVersion 0.0.1
 * @apiName PostNotification
 * @apiGroup Notifications
 *
 * @apiSampleRequest http://localhost:24000/notifications
 *
 * @apiParam (Body) {Object}  metadata          Metadata used to assemble the settings and the body of the notification.
 * @apiParam (Body) {String}  metadata[subject] Subject (Email: email subject).
 * @apiParam (Body) {String}  metadata[to]      Sender (Email: email to).
 * @apiParam (Body) {String}  metadata[Text]    All needed information to send.
 *
 * @apiExample {json} Send **Email** Request Example
 *     {
 *       "files": ...,
 *       "metadata": {
 *         "to": "test@test.com"
 *         "subject": "Test",
 *         "text": "Holaaa!",
 *       }
 *     }
 *
 * @apiUse DefaultError
 */

const _ = require('lodash');
const P = require('bluebird');
const Base = require('../../server/routes/index');
const { logger, errors } = require('../../utils');
const channels = require('../../helpers/channels');
const CHANNELS_TYPE = require('../../../config/channels/types');
const ENABLE = require('../../../config/enable');
const CHANNELS_TYPE_ID = _.invert(CHANNELS_TYPE);

class Route extends Base {
    /**
     * Validate request
     */
    validate (req) {
        if (_.isEmpty(req.body)) {
            throw new errors.BadRequest('Bad request. Please set body parameters');
        }
        if (_.isEmpty(req.body.metadata)) {
            throw new errors.BadRequest('Bad request. Please set metadata on body parameters');
        }
        // TODO Es una validación por si se incorporan otros medios de notificación, como sms
        if ((!_.isEmpty(req.files) || !_.isEmpty(req.body.files)) && ![CHANNELS_TYPE.emailTwilio].includes(Number(req.body.idChannel))) {
            throw new errors.BadRequest('Bad request. Files can only be sent via email');
        }
    }

    /**
     * Handle request
     */
    handler (req, res) {
        const context = {
            idChannel: ENABLE.channelsPriorityEmails[0],
            metadata: req.body.metadata,
            asynchronous: (req.body.async || req.query.async) || 0,
            files: req.body.files || req.files
        };

        return P.bind(this)
            .then(() => this.shippingFlow(context))
            .catch(error => {
                const secondProvider = ENABLE.channelsPriorityEmails[1];
                if (ENABLE.enableSecondPriority && secondProvider) {
                    context.idChannel = secondProvider;
                    return P.bind(this)
                        .then(() => this.shippingFlow(context));
                }
                if (!(error instanceof errors.CustomError)) throw error;
                throw errors.from(error);
            });
    }

    shippingFlow (context) {
        return P.bind(this)
            .then(() => this.getChannel(context))
            .then(() => this.getDispatcher(context))
            .then(() => this.verify(context))
            .then(() => this.delivery(context))
            .then(() => {
                return {
                    code: 200,
                    status: 'ok'
                };
            });
    }

    /**
     * Get Notification Channel
     */
    getChannel (context) {
        if (!CHANNELS_TYPE_ID[context.idChannel]) {
            throw new errors.NotFound(`Not found channel ${context.idChannel}`);
        }
    }

    /**
     * Get Notification dispatcher
     */
    getDispatcher (context) {
        const dispatcher = channels[context.idChannel];

        if (!dispatcher) {
            throw new errors.NotFound(`Not found channel ${context.idChannel}`);
        }
        context.dispatcher = dispatcher;
        return dispatcher;
    }

    /**
     * Verify metadata with template.
     */
    verify (context) {
        return P.bind(this)
            // Check if metadata with template is valid.
            .then(() => context.dispatcher.validate(context.metadata))
            .then(valid => {
                if (!valid) {
                    throw new errors.BadRequest(`Not acceptable metadata ${JSON.stringify(context.metadata)}`);
                }
                return context.dispatcher;
            });
    }

    /**
     * Handle dispatch notification.
     */
    delivery (context) {
        return P.bind(this)
            .then(() => {
                if (!context.asynchronous) {
                    // Dispatch notification synchronous
                    return this.dispatch(context);
                }
                // Dispatch notification asynchronous
                setTimeout(() => this.dispatch(context).then(P.resolve).catch(P.resolve), 100);
                return this.notification(context);
            });
    }

    /**
     * Dispatch notification.
     */
    dispatch (context) {
        if (!_.isEmpty(context.files)) {
            context.metadata.files = context.files;
        }
        return context.dispatcher
            .dispatch(context.metadata)
            // Handle response Ok
            .then(response => {
                logger.info(JSON.stringify(response));
                logger.success(`Dispatch notification [provider: ${CHANNELS_TYPE_ID[context.idChannel]}, id_channel: ${context.idChannel}].`);
                context.notification = response;
                return response;
            })
            // Handle response Error
            .catch(error => {
                logger.error(`Error on dispatch notification [provider: ${CHANNELS_TYPE_ID[context.idChannel]}, id_channel: ${context.idChannel}]. ${error}`);
                logger.error(JSON.stringify(error));
                throw error;
            });
    }

    /**
     * Notification object
     */
    notification (context) {
        return context.notification || {};
    }
}

module.exports = (new Route()).handlerize();
