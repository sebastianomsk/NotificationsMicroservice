'use strict';

const { app } = require('./server');
const controllers = require('./controllers');

// Middlewares

// Routes
app.get('/ping', controllers.health);

// Start server
app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('Listening in port: 3000');
});

module.exports = app;
