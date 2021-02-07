'use strict'

const ListaIngreso = require('../model/listaIngreso.model');
const ListaPedido = require('../model/listaPedido.model');
const Pedido = require('../model/pedido.model');
const Moment = require('moment');

async function getKardex(req, res) {
  var kardex = await calculateCardex();

  return res.status(200).send({
    kardex: kardex
  });
}

async function setValues() {
  var kardex = await calculateCardex();
  kardex.sort(function (a, b) {
    if (new Date(a.Fecha) > new Date(b.Fecha)) return 1;
    if (new Date(a.Fecha) < new Date(b.Fecha)) return -1;
    return 0
  });
}
// async function calculateGeneralKardex() {

// }
async function calculateCardex() {
  var listaIngresos = await ListaIngreso.find({
    Active: true
  }).populate({
    path: 'Created.By Updated.By ProductoVariante Ingreso',
    populate: {
      path: 'Persona Role Producto Bodega BodegaTraslado Received.By'
    }
  }).exec();
  var pedidosList = await ListaPedido.find().populate({
    path: 'Created.By Updated.By ProductoVariante Pedido',
    populate: {
      path: 'Persona Role Bodega Producto Client'
    }
  }).exec();
  var kardex = [];
  var pedido = await Pedido.find().populate({
    path: 'Created.By Updated.By Client Bodega',
    populate: {
      path: 'Persona Role'
    }
  }).exec();
  /**
   * Agregar Traslados y su costo de envio
   */
  listaIngresos.forEach(item => {
    let numb = 'Ingreso '
    const listaKardex = {
      Fecha: item.Ingreso.Received.At,
      Numero: numb + item.Ingreso.Number,
      Descripcion: item.ProductoVariante.Producto.Name + ' - ' + item.ProductoVariante.Color,
      Origen: { Name: 'Fabrica' },
      Bodega: item.Ingreso.Bodega._id,
      Destino: item.Ingreso.Bodega,
      Cliente: null,
      Unidades: {
        Entrada: item.Units,
        Salida: 0,
        Saldos: 0
      },
      CostosProducto: {
        Entrada: 0,
        Salida: 0,
        Saldos: 0
      },
      CostosGenerales: {
        Entrada: 0,
        Salida: 0,
        Saldos: 0
      }
    };
    if (item.Ingreso.BodegaTraslado) {
      listaKardex.Origen = item.Ingreso.Bodega;
      listaKardex.Destino = item.Ingreso.BodegaTraslado;
      listaKardex.Unidades.Salida = item.Units;
      listaKardex.Unidades.Entrada = 0;
    }
    kardex.push(listaKardex);
  });

  pedidosList.forEach(item => {
    let numb = 'Pedido '
    // console.log(item);

    const listaKardex = {
      Fecha: item.Pedido.OrderDate,
      Numero: numb + item.Pedido.Number,
      Descripcion: item.ProductoVariante.Producto.Name + ' - ' + item.ProductoVariante.Color,
      Bodega: item.Pedido.Bodega._id,
      Origen: item.Pedido.Bodega,
      Destino: { Name: 'Ciudad: ' + item.Pedido.City },
      Cliente: item.Pedido.Client,
      Unidades: {
        Entrada: 0,
        Salida: item.Units,
        Saldos: 0
      },
      CostosProducto: {
        Entrada: item.FinalValue,
        Salida: 0,
        Saldos: 0
      },
      CostosGenerales: {
        Entrada: item.FinalValue,
        Salida: 0,
        Saldos: 0
      }
    };
    kardex.push(listaKardex);
  });
  pedido.forEach(item => {
    let numb = 'Pedido '
    // console.log(item);

    const listaKardex = {
      Fecha: item.OrderDate,
      Numero: numb + item.Number,
      Descripcion: 'Envio',
      Bodega: item.Bodega._id,
      Origen: item.Bodega,
      Destino: { Name: 'Ciudad: ' + item.City },
      Cliente: item.Client,
      Unidades: {
        Entrada: 0,
        Salida: 0,
        Saldos: 0
      },
      CostosProducto: {
        Entrada: item.SendCost,
        Salida: 0,
        Saldos: 0
      },
      CostosGenerales: {
        Entrada: item.SendCost,
        Salida: 0,
        Saldos: 0
      }
    };
    kardex.push(listaKardex);
  })

  kardex.sort(function (a, b) {
    if (new Date(a.Fecha) > new Date(b.Fecha)) return 1;
    if (new Date(a.Fecha) < new Date(b.Fecha)) return -1;
    return 0
  });
  /**
   * Calculo de Kardex
   */
  // kardex[0].Unidades.Saldos = kardex[0].Unidades.Entrada - kardex[0].Unidades.Salida;
  // kardex[0].CostosProducto.Saldos = kardex[0].CostosProducto.Entrada - kardex[0].CostosProducto.Salida;
  kardex[0].CostosGenerales.Saldos = kardex[0].CostosGenerales.Entrada - kardex[0].CostosGenerales.Salida;
  for (let i = 1; i < kardex.length; i++) {
    const item = kardex[i];
    item.CostosGenerales.Saldos = kardex[i - 1].CostosGenerales.Saldos + (item.CostosGenerales.Entrada - item.CostosGenerales.Salida);
  }
  return kardex;
}

module.exports = {
  getKardex
}