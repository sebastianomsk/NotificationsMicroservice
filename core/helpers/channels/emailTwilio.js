'use strict';

const _ = require('lodash');
const P = require('bluebird');
const Base = require('./base.js');
const { validator, errors } = require('../../utils');
const EMAIL_TWILIO_CONFIG = require('../../../config/channels/emailTwilio');
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(EMAIL_TWILIO_CONFIG.options.SENDGRID_API_KEY);

class Dispatcher extends Base {
    constructor () {
        super(EMAIL_TWILIO_CONFIG);
        this.transporter = sgMail;
    }

    validate (options) {
        // Validate options
        if (!options) {
            return false;
        }
        // Validate to
        if (!options.to || (_.isArray(options.to) && !_.every(options.to, (value) => validator.isEmail(value))) || (_.isString(options.to) && !validator.isEmail(options.to))) {
            return false;
        }
        // Validate Subject
        if (!_.isString(options.subject) || _.isEmpty(options.subject.trim())) {
            return false;
        }
        return super.validate(options);
    }

    dispatch (options, retry = false) {
        const data = this.data(this.getBody(options), options);

        // return P.resolve(data);
        return new P((resolve, reject) => {
            return this.transporter.send(data, (error, info) => {
                // Handle response Error
                if (error) return reject(new Error(error));

                // Handle response Empty
                if (!info) return reject(new errors.Conflict('No data on response'));

                // Handle response Ok
                return resolve({
                    messageResponse: info
                });
            });
        });
    }

    data (html, options) {
        return _.extend({}, _.omit(options, ['subject', 'text', 'html', 'to']), {
            subject: _.template(options.subject)(options),
            from: _.isArray(options.from) ? options.from.join(', ') : (options.from || EMAIL_TWILIO_CONFIG.from),
            to: _.isArray(options.to) ? options.to.join(', ') : options.to,
            text: options.text,
            html,
            attachments: this.getAttachments(options.files)
        });
    }

    getAttachments (files) {
        return _.map(files, file => {
            if (_.isString(file)) {
                return {
                    path: file
                };
            }
            return {
                content: file.value,
                filename: file.options.filename
            };
        });
    }
}

module.exports = new Dispatcher();
