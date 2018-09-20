import app from './app';

/**
 * Error Handler. Provides full stack - remove for production
 */
if (process.env.NODE_ENV === 'development') {
    // only use in development
    const errorhandler = require('errorhandler');
    app.use(errorhandler());
  }

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
    console.log(
        '  App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
    );
    console.log('  Press CTRL-C to stop\n');
});

export default server;
