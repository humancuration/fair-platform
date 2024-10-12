import { GreenockExpress } from 'greenlock-express';
import { Application } from 'express';

const greenlock: GreenockExpress = require('greenlock-express');

greenlock
  .init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: 'your-email@example.com',
    cluster: false
  })
  .ready(httpsWorker);

function httpsWorker(glx: GreenockExpress): void {
  const app: Application = require('./dist/index').default; // Adjust this path to your main Express app file
  glx.serveApp(app);
}
