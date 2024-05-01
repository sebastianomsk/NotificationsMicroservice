'use strict';

async function health (req, res) {
    res.send({ message: 'pong' });
}

module.exports = health;
