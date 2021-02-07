'use strict'

const Stock = require('../model/stock.model');
const ListaIngreso = require('../model/listaIngreso.model');
const Bodega = require('../model/bodega.model');
const ListaPedido = require('../model/listaPedido.model');
const Variante = require('../model/variante.model');
const Moment = require('moment');

// funciones
function Create(req, res) {
    const params = req.body;
    const stock = new Stock();
    let noUns = "",
        noBod = "",
        noProd = "",
        noAdding = "";
    if (!params.Units) noUns = "[Units]";
    if (!params.Bodega) noBod = "[Bodega]";
    if (!params.Producto) noProd = "[Producto]";
    if (!params.Adding) noAdding = "[in/Out Status]";

    if (params.Units && params.Bodega && params.Producto && params.Adding) {
        stock.Units = params.Units;
        stock.Adding = params.Adding;
        stock.Bodega = params.Bodega;
        stock.Producto = params.Producto;
        stock.Created.By = req.empleado.id;

        stock.save((ErrorSave, stored) => {
            if (ErrorSave) return res.status(500).send({
                Message: 'Error while save Stock'
            });
            if (stored && stored != null) {
                return res.status(201).send({
                    Message: 'Stock Saved!'
                });
            } else return res.status(404).send({
                Message: 'Error: Stock Saved null'
            });
        });
    } else {
        return res.status(500).send({
            Message: 'Error creating Stock, Required Fields: ' + noUns + ' ' + noBod + ' ' + noProd + ' ' + noAdding
        })
    }
}

// READ
function Reads(req, res) {
    const Active = req.params.active;
    let Query = Stock.find({
        Active
    });

    if (!Active || (Active != 'true' && Active != 'false')) Query = Stock.find()
    Query.populate({
        path: 'Bodega ProductoVariante',
        populate: {
            path: 'Producto'
        }

    }).exec((Error, Response) => {
        if (Error) return res.status(500).send({
            Message: 'Internal Server Error',
            Error
        });
        if (!Response) return res.status(404).send({
            Message: 'Collection not Found'
        });
        if (Response == null || Response == undefined) return res.status(200).send({
            Message: 'No Collections registered'
        });
        return res.status(200).send({
            Message: 'Query Succeful',
            Stock: Response
        });
    })
}
async function Read(req,res) {
    let stocksHistorico = await Stock.find().populate({
        path:'Bodega Variante', 
        populate: {
            path: 'Producto City',
            populate: {
                path: 'Canton',
                populate: 'Provincia'
            }
        }}).exec();
    const Active = req.params.active;
    let Bodegas = await Bodega.find().populate().exec();
    let StocksByBodega = [];
    Bodegas.forEach(bodega => {
        if (!StocksByBodega.find(stock => bodega._id.toString() == stock.Bodega._id.toString())) {
            let temp = {
                Bodega: bodega,
                Variantes: [],
                listaIngreso: '',
                // Stock: {
                //     Date: '',
                //     Units: 0,
                //     Ins: 0,
                //     Moved: 0,
                //     Outs: 0,
                //     TotalProx: 0,
                //     TotalReal: 0,
                // }
            } 
            StocksByBodega.push(temp);
        }
    });

    StocksByBodega.forEach(bodega => {
        stocksHistorico.forEach(stock => {
            if ( !bodega.Variantes.find(vars => 
                    vars.Bodega._id.toString() === stock.Bodega._id.toString() && vars.Variante._id.toString() === stock.Variante._id.toString()
                )) {
                if (stock.Bodega._id.toString() == bodega.Bodega._id.toString()) {
                    let temp = {
                        Bodega: stock.Bodega,
                        Variante: stock.Variante,
                        Date: '',
                        Units: 0,
                        Ins: 0,
                        Moved: 0,
                        Outs: 0,
                        InsProx: 0,
                        MovedProx: 0,
                        OutsProx: 0,
                        CostOut    : 0,
                        CostOutProx: 0,
                        CostIn     : 0,
                        CostInProx : 0,
                        UnitsProx : 0,
                        Historico: []
                    }
                    bodega.Variantes.push(temp)
                }
            }
        });
    });
    StocksByBodega.forEach(bodega => {
        bodega.Variantes.forEach(variante => {
            stocksHistorico.forEach(stock => {
               if (variante.Bodega._id.toString() == stock.Bodega._id.toString() && variante.Variante._id.toString() == stock.Variante._id.toString()) {
                variante.Ins         += stock.Ins         ;
                variante.Moved       += stock.Moved       ;
                variante.Outs        += stock.Outs        ;
                variante.InsProx   += stock.InsProx   ;
                variante.MovedProx   += stock.MovedProx   ;
                variante.OutsProx   += stock.OutsProx   ;
                variante.CostOut       += stock.CostOut       ;
                variante.CostOutProx   += stock.CostOutProx   ;
                variante.CostIn        += stock.CostIn        ;
                variante.CostInProx    += stock.CostInProx    ;
                variante.UnitsProx    += stock.UnitsProx    ;
                if (Active) {
                    variante.Historico.push(stock);
                }
               } 
            });
            variante.Units = variante.Ins - variante.Moved - variante.Outs;
            variante.UnitsProx = variante.InsProx - variante.MovedProx - variante.OutsProx;
        });
    });
    // Stocks.forEach(stockGlobal => {
    //     stocksHistorico.forEach(stock => {
    //         if (stockGlobal.Bodega._id.toString() == stock.Bodega._id.toString() && stockGlobal.Variante._id.toString() == stock.Variante._id.toString()) {
    //             stockGlobal.Ins         += stock.Ins         ;
    //             stockGlobal.Moved       += stock.Moved       ;
    //             stockGlobal.Outs        += stock.Outs        ;
    //             stockGlobal.TotalProx   += stock.TotalProx   ;
    //             stockGlobal.TotalReal   += stock.TotalReal   ;
    //             if (Active) {
    //                 stockGlobal.StockHistorico.push(stock);
    //             }
    //         }
    //     });
    //     stockGlobal.Units = stockGlobal.Ins - stockGlobal.Moved - stockGlobal.Outs;
    // });

    return res.status(200).send({
        Message: 'Query succeful',
        StocksGlobal: StocksByBodega
    })
    
}
// UPDATE
function Update(req, res) {
    const Id = req.params.id;
    req.body.Updated.By = req.usuario.id;
    req.body.Updated.At = Moment().unix();
    const Update = req.body;

    // new: true hace que envie los datos despues de actualizar y no el estado anterior
    Stock.findByIdAndUpdate(Id, Update, {
        new: true
    }, (Error, Updated) => {
        if (Error) return res.status(500).send({
            Message: 'Error during Stock Update!!',
            Error
        });
        if (!Updated || Updated == null) return res.status(404).send({
            Message: 'Error during Stock Update!!!, Server does not response'
        });
        return res.status(200).send({
            Message: 'Stock Updated succeful!',
            Stock: Updated
        });
    });
}

// DELETE
function Delete(req, res) {
    const Id = req.params.id;
    req.body.Updated.By = req.usuario.id;
    req.body.Updated.At = Moment().unix();
    // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

    // new: true hace que envie los datos despues de actualizar y no el estado anterior
    Stock.findByIdAndUpdate(Id, req.body, {
        new: true
    }, (Error, Updated) => {
        if (Error) return res.status(500).send({
            Message: 'Error during Stock Delete!!',
            Error
        });
        if (!Updated || Updated == null) return res.status(404).send({
            Message: 'Error during Stock Delete!!!, Server does not response'
        });
        return res.status(200).send({
            Message: 'Stock Deleted succeful!',
            Stock: Updated
        });
    });
}
async function getIngresos(req, res) {
    var listaIngresos = await ListaIngreso.find({
        Active: true
    }).populate({
        path: 'Created.By Updated.By ProductoVariante Ingreso',
        populate: {
            path: 'Persona Role Producto Bodega BodegaTraslado Received.By'
        }
    }).exec();
    var bodegas = await Bodega.find({Active: true}).exec();
    var variantes = await Variante.find().populate({
        path: 'Producto'
    }).exec();
    var stocks = await Stock.find().populate({
        path: 'Created.By Updated.By Bodega Variante',
        populate: {
            path: 'Persona Role Producto'
        }

    }).exec();
    var pedidosList = await ListaPedido.find().populate({
        path: 'Created.By Updated.By ProductoVariante Pedido',
        populate: {
            path: 'Persona Role Bodega Producto'
        }

    }).exec();
    for (const bodega of bodegas) {
        for (const colorProd of variantes) {
            var stock = new Stock();
                stock.Units = 0;
                stock.Ins = 0;
                stock.Moved = 0;
                stock.Outs = 0;
                stock.TotalProx = 0;
                stock.TotalReal = 0;
                stock.Bodega = bodega._id;
                stock.ProductoVariante = colorProd._id;
                stock.Active = true;
            if (!stocks.find(stk => stk.Bodega._id.toString() == stock.Bodega.toString() && stk.ProductoVariante._id.toString() == stock.ProductoVariante.toString())) {
                let temp = await stock.save();
                // stocks.push(temp);
            }
        } 
    }
    if (!stocks || stocks.length ==0) {
        stocks = await Stock.find().populate({
            path: 'Created.By Updated.By Bodega ProductoVariante',
            populate: {
                path: 'FK_Persona FK_Role Producto'
            }
    
        }).exec();
    }
    for (const stock of stocks) {
        stock.Units = 0;
        stock.Ins = 0;
        stock.Outs = 0;
        stock.Moved = 0;
        for (const lista of listaIngresos) {
            if (lista.Ingreso.Bodega._id.toString() == stock.Bodega._id.toString() && lista.ProductoVariante._id.toString() == stock.ProductoVariante._id.toString()) {
                if (!lista.Ingreso.BodegaTraslado) {
                    stock.Units +=lista.Units;
                    stock.Ins +=lista.Units;
                } else {
                    stock.Units -=lista.Units;
                    stock.Moved -=lista.Units;
                }
            }
            if (lista.Ingreso.BodegaTraslado){
                if (lista.Ingreso.BodegaTraslado._id.toString() == stock.Bodega._id.toString() && lista.ProductoVariante._id.toString() == stock.ProductoVariante._id.toString()) {
                    stock.Units +=lista.Units;
                    stock.Moved +=lista.Units;
                }
            }
        }
        stock.TotalProx = stock.Units;
        stock.TotalReal = stock.Units;
    }
    for (const stock of stocks) {
        for (const lista of pedidosList) {
            if (lista.Pedido.Bodega._id.toString() == stock.Bodega._id.toString() && lista.ProductoVariante._id.toString() == stock.ProductoVariante._id.toString() && lista.Pedido.State.toLowerCase() == 'entregado' ) {
                stock.TotalReal -= lista.Units;
                stock.Outs += lista.Units;
            }
            if (lista.Pedido.Bodega._id.toString() == stock.Bodega._id.toString() && lista.ProductoVariante._id.toString() == stock.ProductoVariante._id.toString() && lista.Pedido.State.toLowerCase() == 'pendiente' ) {
                stock.TotalProx -= lista.Units;
                stock.Outs += lista.Units;
            }
        }
        const temp = Stock.findByIdAndUpdate(stock._id, stock, {new: true}, (err, response) => {
        });
    }

    const FinalStocks = await Stock.find().populate({
        path: 'Created.By Updated.By Bodega ProductoVariante',
        populate: {
            path: 'FK_Persona FK_Role Producto'
        }

    }).exec();
    return res.status(200).send({
        stocks: FinalStocks
    });
}
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete,
    getIngresos
}