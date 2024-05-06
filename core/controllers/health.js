'use strict';

'use strict';

/**
 * @api {get} /ping Get Ping return Pong if it is alive.
 * @apiVersion 0.0.1
 * @apiName GetNotification
 * @apiGroup Notifications
 *
 * @apiSampleRequest http://localhost:24000/ping
 *
 *
 * @apiExample {json} Response Example
 *     {
 *       message: pong
 *     }
 *
 * @apiUse DefaultError
 */

async function health (req, res) {
    res.send({ message: 'pong' });
}

module.exports = health;
