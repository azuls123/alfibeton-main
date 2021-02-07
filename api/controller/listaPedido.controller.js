'use strict'

const ListaPedido = require('../model/listaPedido.model');
const Moment = require('moment');
const Pedido = require('../model/pedido.model');
const Stock = require('../model/stock.model');

// funciones
    async function addStock(listaPedido) {
        let pedido = (await Pedido.findById(listaPedido.Pedido).exec());
        let NewStock = new Stock();
        NewStock.Date = Moment(pedido.OrderDate).unix();
        NewStock.Bodega = pedido.Bodega;
        NewStock.Variante = listaPedido.ProductoVariante;
        NewStock.ListaPedido = listaPedido;
        
        NewStock.Ins = 0;
        NewStock.InsProx = 0;
        
        NewStock.Outs       = listaPedido.Units;
        NewStock.OutsProx   = listaPedido.UnitsProx;
        
        NewStock.Moved = 0;
        NewStock.MovedProx = 0;
        
        NewStock.UnitsProx = 0;
        NewStock.Units = 0;

        NewStock.CostIn     = 0;
        NewStock.CostInProx = 0;

        NewStock.CostOut     = listaPedido.FinalValue;
        NewStock.CostOutProx = listaPedido.FinalValueProx;

        NewStock.Description = 'Pedido N°: ' + pedido.Number;
        NewStock.save((errorSave, Stored)=> {
            if (errorSave) console.error(errorSave);
            if (!Stored) console.log('error a guardar el stock');
            return Stored;
        });
    }

    function Create(req, res) {
        const params = req.body;
        const listaPedido = new ListaPedido();
        let noUns = "", noVal = "", noPed = "", noStock = "";
        // if (!params.Units) noUns = "[Units]"; if (!params.Value) noVal = "[Value]"; if (!params.Pedido) noPed = "[Pedido]"; if (!params.Stock) noStock = "[Stock]";
        
        if(params.ProductoVariante && params.UnitsSell && params.ValueByUnits && params.FinalValueProx && params.Pedido){
            listaPedido.Pedido              = params.Pedido      ;
            listaPedido.ProductoVariante    = params.ProductoVariante   ;
            listaPedido.UnitsSell           = params.UnitsSell   ;
            listaPedido.UnitsFree           = params.UnitsFree   ;
            listaPedido.Units               = params.Units       ;
            listaPedido.ValueByUnits        = params.ValueByUnits;
            listaPedido.Discount            = params.Discount    ;
            listaPedido.Percent             = params.Percent     ;
            listaPedido.ValueIdeal          = params.ValueIdeal  ;
            listaPedido.TotalDiscount       = params.TotalDiscount   ;
            listaPedido.UnitsBack           = params.UnitsBack   ;
            listaPedido.OrderCode           = params.OrderCode   ;
            listaPedido.Received            = params.Received    ;
            if (params.Delivered && params.Delivered.By) {
                listaPedido.Delivered           = params.Delivered  ;
            }
            listaPedido.FinalValue          = params.FinalValue  ;
            listaPedido.FinalValueProx      = params.FinalValueProx  ;

            listaPedido.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save ListaPedido', ErrorSave});
                if (stored && stored != null) {
                    addStock(stored).then();
                    return res.status(201).send({Message: 'Producto Saved!'});
                } else return res.status(404).send({Message: 'Error: ListaPedido Saved null'});
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating ListaPedido, Required Fields: ' + noUns + ' ' + noVal + ' ' + noPed + ' ' + noStock
            })
        }
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = ListaPedido.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = ListaPedido.find()
        Query.populate({
            path: 'Created.By Updated.By ProductoVariante Pedido',
            populate: {
                path: 'Persona Bodega Producto Client'
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', ListaPedidos: Response});
        })
    }

    async function UpdateStock(listaPedido) {
        let pedido = (await Pedido.findById(listaPedido.Pedido).exec());
        let ChangedStock = {
            Date            : Moment().unix(),
            Bodega          : pedido.Bodega,
            Variante        : listaPedido.ProductoVariante,
            // ListaIngreso    : listaIngreso,
            ListaPedido     : listaPedido,

            Ins             : 0,
            InsProx         : 0,

            Outs            : listaPedido.Units,
            OutsProx        : listaPedido.UnitsProx,
            
            Moved           : 0,
            MovedProx       : 0,
            
            UnitsProx       : 0,
            Units           : 0,

            CostIn          : 0,
            CostInProx      : 0,
            
            CostOut         : listaPedido.FinalValue,
            CostOutProx     : listaPedido.FinalValueProx,
        }
        Stock.findOneAndUpdate({ListaPedido: listaPedido, Bodega: pedido.Bodega}, ChangedStock, (error, Updated) => {
            if (error) console.error(error);
            if (!Updated) console.error(`Sin Respuesta al Guardar`);
            return Updated;
        });
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        ListaPedido.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during ListaPedido Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during ListaPedido Update!!!, Server does not response'}); 
            UpdateStock(Updated).then(); 
            return res.status(200).send({Message: 'ListaPedido Updated succeful!', ListaPedido: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        ListaPedido.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during ListaPedido Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during ListaPedido Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'ListaPedido Deleted succeful!', ListaPedido: Updated});
        });
    }
    // async function DeleteFromStock(listaPedido) {
        // var check = await (await Stock.findOneAndDelete({ListaPedido: listaPedido})).exec()
        
        // return check
    // }
    async function DeletePedido(req, res) {
        const id = req.params.id;
        ListaPedido.findByIdAndDelete(id).exec((error, response) => {
            if (error) return res.status(500).send({Message: 'Error during delete', Error: error});
            if (!response) return res.status(404).send({Message: 'Cannot delete the pedido items'});
            var check = await (Stock.findOneAndDelete({ListaPedido: id})).exec();
            return res.status(200).send({Message: 'Pedido Items deleted succefully', check});
        })

    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete,
    DeletePedido
}