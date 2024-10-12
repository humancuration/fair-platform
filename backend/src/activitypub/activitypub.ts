import express from 'express';
import ActivitypubExpress from 'activitypub-express';

const app = express();
const apex = ActivitypubExpress({
  name: 'Fair Platform',
  domain: 'fairplatform.com',
  actorParam: 'username',
  objectParam: 'uuid'
});

app.use(apex);

// Set up your routes here

export default app;
