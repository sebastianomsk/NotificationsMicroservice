'use strict';

const CHANNELS_PRIORITY_EMAILS = process.env.CHANNELS_PRIORITY_EMAILS || '[1,2]';
const ENABLE_SECOND_PRIORITY = ['true', '1'].includes(process.env.ENABLE_SECOND_PRIORITY || 'false');

module.exports = {
    channelsPriorityEmails: JSON.parse(CHANNELS_PRIORITY_EMAILS),
    enableSecondPriority: ENABLE_SECOND_PRIORITY
};
