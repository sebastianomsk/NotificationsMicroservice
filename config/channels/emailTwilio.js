'use strict';

const CHANNEL_EMAIL_FROM = process.env.CHANNEL_EMAIL_FROM || '';

module.exports = {
    id: 1,
    from: CHANNEL_EMAIL_FROM,
    options: {
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
    }
};
