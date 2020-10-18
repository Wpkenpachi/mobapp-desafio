const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config();
const routes = require('./routes');
const cors = require('cors');

const api = new ParseServer({
  databaseURI: process.env.DATABASE_URI,
  appId: process.env.APPLICATION_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.SERVER_URL,
});

app.use('/parse', api);
app.use(routes);
app.use(cors);

app.listen(process.env.PORT, function() {
  console.log('parse-server-example running on port ' + process.env.PORT);
});