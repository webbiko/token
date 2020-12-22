const logger = require("../controllers/logger.controller");
logger.init();

const axios = require('axios');
const express = require('express');
const helmet = require("helmet");
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));

require("../routes/token.routes")(app, axios);
module.exports = app;
module.exports.axios = axios;