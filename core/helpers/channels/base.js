'use strict';

const P = require('bluebird');
const TYPES = require('../../../config/channels/types');

class Dispatcher {
    constructor (options) {
        this.options = options || {};
        this.types = TYPES;
    }

    dispatch (options) {
        throw new Error('NotImplemented');
    }

    silentDispatch (options, delay = 100) {
        setTimeout(() => this.dispatch(options).then(P.resolve).catch(P.resolve), delay);
    }

    validate (options) {
        return true;
    }

    getBody (data) {
        // const html = `<strong>${data.text}</strong>`
        return data.text;
    }
}

module.exports = Dispatcher;
