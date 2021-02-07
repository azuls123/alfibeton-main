'use strict'

const Express = require('express');
const Controller = require('../controller/empresa.controller');
const Api = Express.Router();
const Authenticate = require('../middleware/authenticate');

// rutas
    Api.post('/create',Authenticate.ensureAuth , Controller.Create);
    Api.get('/read/:active?',Authenticate.ensureAuth , Controller.Read);
    Api.put('/update/:id',Authenticate.ensureAuth , Controller.Update);
    Api.put('/delete/:id',Authenticate.ensureAuth , Controller.Delete);

module.exports = Api;
