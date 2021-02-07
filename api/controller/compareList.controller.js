'use strict'

const Persona = require('../model/persona.model');
const Usuario = require('../model/usuario.model');
const Producto = require('../model/producto.model');
const Bodega = require('../model/bodega.model');
const Pedido = require('../model/pedido.model');
const Ingreso = require('../model/ingreso.model');
const Moment = require('moment');
// funciones
    async function getList(req,res) {
        var Cedulas = await Persona.find({Ci:  {$ne: '', $ne: undefined}}, {Ci: 1, _id: 0}).exec();
        var Telefonos = await Persona.find({Phone:  {$ne: '', $ne: undefined}}, {Phone: 1, _id: 0}).exec();
        var Correos = await Usuario.find({Email: {$ne: '', $ne: undefined}}, {Email:1, _id:0}).exec();
        var Bodegas = await Bodega.find({}, {Name: 1, _id: 0}).exec();
        var Productos = await Producto.find({}, {Name: 1, _id: 0}).exec();
        var Placas = await Usuario.find({RepData: {$ne: {Placa: '', Tipo: ''}}}, {RepData:{ Placa: 1}, _id: 0}).exec();
        var Ingresos = await Ingreso.find({}, {Number: 1, _id: 0}).exec();
        var Pedidos = await Pedido.find({}, {Number: 1, _id: 0}).exec();
        return res.status(200).send({Cedulas, Telefonos, Correos, Bodegas, Productos, Placas, Ingresos, Pedidos})
    }
// exportaciones
module.exports = {
    getList
}