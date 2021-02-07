'use strict'

const ListaIngreso = require('../model/listaIngreso.model');
const Ingreso = require('../model/ingreso.model');
const Stock = require('../model/stock.model');
const Moment = require('moment');
// funciones
    async function addStock(listaIngreso) {
        let ingreso = (await Ingreso.findById(listaIngreso.Ingreso).exec());
        let NewStock = new Stock();
        NewStock.Date = Moment(ingreso.SuggestedDate).unix();
        NewStock.Bodega = ingreso.Bodega;
        NewStock.Variante = listaIngreso.ProductoVariante;
        NewStock.ListaIngreso = listaIngreso;
        
        NewStock.Ins = listaIngreso.UnitsReceiveds;
        NewStock.InsProx = listaIngreso.Units;
        
        NewStock.Outs = 0;
        NewStock.OutsProx = 0;
        
        NewStock.Moved = 0;
        NewStock.MovedProx = 0;
        
        NewStock.UnitsProx = listaIngreso.Units;
        NewStock.Units = listaIngreso.UnitsReceiveds;

        NewStock.CostIn     = 0;
        NewStock.CostInProx = 0;

        NewStock.CostOut     = 0;
        NewStock.CostOutProx = 0;
        
        if(!(ingreso.BodegaTraslado && ingreso.BodegaTraslado != '')) {
            NewStock.Description = 'Ingreso N°: '+ingreso.Number;
        } else {
            NewStock.Description = 'Destino Traslado N°: '+ingreso.Number;
        }

        NewStock.save((errorSave, Stored)=> {
            if (errorSave) console.error(errorSave);
            if (!Stored) console.log('error a guardar el stock');
            return Stored;
        });
        if (ingreso.BodegaTraslado && ingreso.BodegaTraslado!='') {
            let NewTraslado = new Stock();
            NewTraslado.Date = Moment(ingreso.SuggestedDate).unix();
            NewTraslado.Bodega = ingreso.BodegaTraslado;
            NewTraslado.Variante = listaIngreso.ProductoVariante;
            NewTraslado.Ins = 0;
            NewTraslado.InsProx = 0;
            NewTraslado.Description = 'Origen Traslado N°: '+ingreso.Number;
            NewTraslado.Moved = listaIngreso.UnitsReceiveds;
            NewTraslado.MovedProx = listaIngreso.Units;
            NewTraslado.Outs = 0;
            NewTraslado.OutsProx = 0;
            NewTraslado.CostOut     = 0;
            NewTraslado.CostOutProx = 0;
            NewTraslado.CostIn     = 0;
            NewTraslado.CostInProx = 0;
            NewTraslado.UnitsProx = 0;
            NewTraslado.Units = 0;
            NewTraslado.ListaIngreso = listaIngreso;
            NewTraslado.save((errorSave, Stored)=> {
                if (errorSave) console.error(errorSave);
                if (!Stored) console.log('error a guardar el stock');
                return Stored;
            });
        }
    }
    // CREATE
    function Create(req, res) {
        const params = req.body;
        const listaIngreso = new ListaIngreso();
        let noIng = '', noProd = '', noUnits ='', noRec= '', noBo=''
        if (!params.Units) noUnits = "[Units]"; 
        if (!params.Ingreso) noIng = "[Ingreso]"; 
        if (!params.ProductoVariante) noProd = "[Product]";  
        if (!params.Received) noRec = '[Received]'+params.Received;
        // if (!params.Bodega) noBo = '[Bodega]'+params.Bodega;

        if(params.Units && params.Ingreso && params.ProductoVariante){
            if (params.UnitsReceiveds) {
                listaIngreso.UnitsReceiveds     = params.UnitsReceiveds         ;
            }
            listaIngreso.Units              = params.Units                  ;
            // listaIngreso.Bodega             = params.Bodega                 ;
            if (params.BodegaTraslado) {
                listaIngreso.BodegaTraslado             = params.BodegaTraslado                 ;

            }
            listaIngreso.ProductoVariante   = params.ProductoVariante       ;
            listaIngreso.Ingreso            = params.Ingreso                ;
            listaIngreso.Received           = params.Received               ;
            listaIngreso.Created.By  = req.usuario.id       ;
            listaIngreso.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save ListaIngreso', ErrorSave});
                if (stored && stored != null) {
                    addStock(stored).then();
                    return res.status(201).send({Message: 'ListaIngreso Saved!', ListaIngreso: stored});
                } else return res.status(404).send({Message: 'Error: ListaIngreso Saved null'});
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating ListaIngreso, Required Fields: ' + noIng  + ' ' + noProd + ' ' + noUnits + ' ' + noRec + ' ' + noBo
            })
        }
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = ListaIngreso.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = ListaIngreso.find()
        Query.populate({
            path: 'Created.By Updated.By ProductoVariante Ingreso',
            populate: {
                path: 'Persona Producto Bodega BodegaTraslado Received.By'
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', ListaIngresos: Response});
        })
    }

    async function UpdateStock(listaIngreso) {
        let ingreso = (await Ingreso.findById(listaIngreso.Ingreso).exec());
        let ChangedStock = {
            Date            : Moment().unix(),
            Bodega          : ingreso.Bodega,
            Variante        : listaIngreso.ProductoVariante,
            ListaIngreso    : listaIngreso,
            
            Ins             : listaIngreso.UnitsReceiveds,
            InsProx         : listaIngreso.Units,

            Outs            : 0,
            OutsProx        : 0,
            
            Moved           : 0,
            MovedProx       : 0,
            
            UnitsProx       : listaIngreso.Units,
            Units           : listaIngreso.UnitsReceiveds,

            CostIn          : 0,
            CostInProx      : 0,
            
            CostOut         : 0,
            CostOutProx     : 0,
        }
        Stock.findOneAndUpdate({ListaIngreso: listaIngreso, Bodega: ingreso.Bodega}, ChangedStock, (error, Updated) => {
            if (error) console.error(error);
            if (!Updated) console.error(`Sin Respuesta al Guardar`);
            return Updated;
        });
        if (ingreso.BodegaTraslado && ingreso.BodegaTraslado!='') {
            let changedTraslado = {
                Date            : Moment().unix(),
                Bodega          : ingreso.BodegaTraslado,
                Variante        : listaIngreso.ProductoVariante,
                ListaIngreso    : listaIngreso,
                            
                Ins             : 0,
                InsProx         : 0,
                Outs            : 0,
                OutsProx        : 0,
                            
                Moved           : listaIngreso.UnitsReceiveds,
                MovedProx       : listaIngreso.Units,
                            
                UnitsProx       : listaIngreso.Units,
                Units           : listaIngreso.UnitsReceiveds,
                CostIn          : 0,
                CostInProx      : 0,
                            
                CostOut         : 0,
                CostOutProx     : 0,
            }
            Stock.findOneAndUpdate({ListaIngreso: listaIngreso, Bodega: ingreso.BodegaTraslado}, changedTraslado, (error, Updated) => {
                if (error) console.error(error);
                if (!Updated) console.error(`Sin Respuesta al Guardar`);
                return Updated;
            });
        }
    }
    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        ListaIngreso.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during ListaIngreso Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during ListaIngreso Update!!!, Server does not response'});
            UpdateStock(Updated).then(); 
            return res.status(200).send({Message: 'ListaIngreso Updated succeful!', ListaIngreso: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id; 
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();    
        // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}


        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        ListaIngreso.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during ListaIngreso Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during ListaIngreso Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'ListaIngreso Deleted succeful!', Ingreso: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete
}