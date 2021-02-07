'use strict'

const Express = require('express');
const Controller = require('../controller/compareList.controller');
const Api = Express.Router();
const Authenticate = require('../middleware/authenticate');

// rutas
    Api.get('/get-list', Controller.getList);

module.exports = Api;
