'use strict';

const _ = require('lodash');

class Logger {
    // eslint-disable-next-line no-useless-constructor
    constructor (req) {
    }

    error (...messages) {
        // If error comes with 'extra' info, append it stringified to the messages
        const errorIndex = _.findIndex(messages, message => message instanceof Error);
        if (messages[errorIndex] && messages[errorIndex].extra) messages.splice(errorIndex, 1, ` - Extra: "${JSON.stringify(messages[errorIndex].extra.stack)}"`);
        this.log('error', ['✘ Ooops...'].concat(messages));
    }

    warn (...messages) {
        this.log('warn', ['⚠'].concat(messages));
    }

    info (...messages) {
        this.log('info', messages);
    }

    success (...messages) {
        this.log('info', ['✔'].concat(messages));
    }

    write (message, encoding) {
        this.log('http', [_.trim(message)]);
    }

    log (method, messages) {
        // eslint-disable-next-line no-console
        console.log(messages.join(' '));
    }
}

module.exports = new Logger();
