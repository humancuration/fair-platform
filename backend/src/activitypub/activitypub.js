const express = require('express')
const ActivitypubExpress = require('activitypub-express')

const app = express()
const apex = ActivitypubExpress({
  name: 'Fair Platform',
  domain: 'fairplatform.com',
  actorParam: 'username',
  objectParam: 'uuid'
})

app.use(apex)

// Set up your routes here
