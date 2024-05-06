'use strict';

const { app } = require('./server');
const controllers = require('./controllers');
const { errors } = require('./server/routes');
const PORT = process.env.PORT;
// Middlewares

// Routes
app.get('/ping', controllers.health);
app.post('/notifications', controllers.notifications.create);

errors(app);

// Start server
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Application Deployed in PORT ${PORT}`);
});

module.exports = app;
