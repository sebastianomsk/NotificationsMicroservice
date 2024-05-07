'use strict';

const _ = require('lodash');
const P = require('bluebird');
const Base = require('./base.js');
const { validator, errors } = require('../../utils');
const EMAIL_AWS_CONFIG = require('../../../config/channels/emailAWS.js');
const AWS = require('aws-sdk');

// Configurar las credenciales de AWS SES
AWS.config.update({
    accessKeyId: EMAIL_AWS_CONFIG.options.accessKey,
    secretAccessKey: EMAIL_AWS_CONFIG.options.secretKey,
    region: EMAIL_AWS_CONFIG.options.region
});

class Dispatcher extends Base {
    constructor () {
        super(EMAIL_AWS_CONFIG);
        this.transporter = new AWS.SES({ apiVersion: EMAIL_AWS_CONFIG.apiVersion });
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

        // return P.resolve({ data: 'aws' });
        return new P((resolve, reject) => {
            return this.transporter.sendEmail(data, (error, info) => {
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
        const data = _.extend({}, _.omit(options, ['subject', 'text', 'html', 'to']), {
            subject: _.template(options.subject)(options),
            from: _.isArray(options.from) ? options.from.join(', ') : (options.from || EMAIL_AWS_CONFIG.from),
            to: _.isArray(options.to) ? options.to.join(', ') : options.to,
            text: options.text,
            html,
            attachments: this.getAttachments(options.files)
        });

        return {
            Destination: {
                ToAddresses: [data.to] // Dirección de correo electrónico del destinatario
            },
            Message: {
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: data.text
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: data.subject
                }
            },
            Source: data.from // Dirección de correo electrónico del remitente
        };
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
