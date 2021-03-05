'use strict'

const Express = require('express');
const Controller = require('../controller/usuario.controller');
const Api = Express.Router();
const Authenticate = require('../middleware/authenticate');

// rutas
    Api.post('/create', Authenticate.ensureAuth , Controller.Create);
    Api.post('/login', Controller.Login);
    Api.get('/read/:active?', Authenticate.ensureAuth , Controller.Read);
    Api.get('/read-motorizados/:empresa?', Authenticate.ensureAuth , Controller.ReadMotorizados);
    Api.put('/update/:id', Authenticate.ensureAuth , Controller.Update);
    Api.put('/change-password', Authenticate.ensureAuth , Controller.changePassword);
    Api.put('/delete/:id', Authenticate.ensureAuth , Controller.Delete);
    Api.post('/complex-read/:active?' , Controller.ComplexRead);

module.exports = Api;
