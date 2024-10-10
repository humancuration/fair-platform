const greenlock = require('greenlock-express');

greenlock
  .init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: 'your-email@example.com',
    cluster: false
  })
  .ready(httpsWorker);

function httpsWorker(glx) {
  const app = require('./dist/index').default; // Adjust this path to your main Express app file
  glx.serveApp(app);
}