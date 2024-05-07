'use strict';

const CHANNEL_EMAIL_FROM = process.env.CHANNEL_EMAIL_FROM || '';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';

module.exports = {
    id: 2,
    from: CHANNEL_EMAIL_FROM,
    options: {
        accessKey: AWS_ACCESS_KEY_ID,
        secretKey: AWS_SECRET_ACCESS_KEY,
        region: AWS_REGION,
    },
    apiVersion: '2010-12-01'
};
