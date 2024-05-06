'use strict';

const CHANNEL_EMAIL_FROM = process.env.CHANNEL_EMAIL_FROM || '';

module.exports = {
    id: 1,
    from: CHANNEL_EMAIL_FROM,
};
