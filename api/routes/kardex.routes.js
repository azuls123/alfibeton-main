'use strict'

const Express = require('express');
const Controller = require('../controller/kardex.controller');
const Api = Express.Router();
const Authenticate = require('../middleware/authenticate');

// rutas
    Api.post('/get',Authenticate.ensureAuth , Controller.getKardex);

module.exports = Api;
