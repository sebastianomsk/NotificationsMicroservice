'use strict';

const emailTwilio = require('./emailTwilio');
const emailAWS = require('./emailAWS');
const channelsTypes = require('../../../config/channels/types');

module.exports = {
    [channelsTypes.emailTwilio]: emailTwilio,
    [channelsTypes.emailAWS]: emailAWS
};
