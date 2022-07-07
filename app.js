const express = require('express');
const path = require('path');
var cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const axios = require('axios');
const helmet = require('helmet');

dotenv.config();
app.use(helmet.hsts())
app.use(helmet.frameguard())
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
app.use('/health',require('./healthcheck.route'));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
const defaultDomain = process.env.REACT_APP_DOMAIN
const defaultUrl = process.env.REACT_APP_API_URL
const clientId = process.env.REACT_APP_X_IBM_CLIENT_MSTEAMS
const server = app.listen(8080, async () => {
  try {
  } catch (error) {
  }
});
process.on("SIGTERM",shutDown);
process.on("SIGINT",shutDown);
async function shutDown () {
	try {
	} catch (err) {
	}
	server.close(() => {
		process.exit(0);
	});

	setTimeout(() => {
		process.exit(1);
	}, 10000);
}