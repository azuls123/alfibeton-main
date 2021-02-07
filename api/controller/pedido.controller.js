'use strict'

const Pedido = require('../model/pedido.model');
const Moment = require('moment');
const Bcrypt = require('bcrypt-nodejs');
const JWT = require('../services/jwt');
// funciones
    async function getNumberOfPedido() {
        let temp = await Pedido.find().exec();
        let Number = 0;
        if (temp && temp.length <=0) {
            Number = 1;
        } else {
            let Unique = false;
            while (Unique == false) {
                Number ++;
                if (!temp.find(ingreso => ingreso.Number == Number)) {
                    Unique = true;
                }
            }
        }
        return Number;
    }
    // CREATE
    function Create(req, res) {
        const params = req.body;
        const pedido = new Pedido();
        getNumberOfPedido().then((Number) => {
            params.Number = Number;
            let noNumber = "", noDelTime = "", noState = "", noCity = "", noAdd = "", noTot = "", noConta = "", noDelv = "", noPers = "", noGPS = "";
            if (!params.Number) noNumber = "[Number]"; 
            // if (!params.DeliveryTime) noDelTime = "[Delivery Time]"; 
            if (!params.City) noCity = "[City]"; 
            if (!params.Address) noAdd = "[Address]";
            if (!params.Total) noTot = "[Total]"; 
            // if (!params.ContactedBy) noConta = "[Contacted By]"; 
            // if (!params.DeliveredBy) noDelv = "[Delivered By]"; 
            // console.log(params);
            if (!params.Client) noPers = "[Client]";
            // if (!params.GPSPoint) noGPS = "[GPS Point]";
            // if (!params.State) noState = "[State]";
            // if(params.Number && params.DeliveryTime && params.City && params.State && params.GPSPoint && params.Address && params.Total && params.ContactedBy && params.DeliveredBy && params.Client){
            if(params.Number && params.Address && params.Total && params.Client){
                pedido.Number                       = params.Number                      ;
                pedido.Client                       = params.Client                      ;
                pedido.OrderDate                    = params.OrderDate                   ;
                pedido.OrderTime                    = params.OrderTime                   ;
                pedido.DeliveryTime                 = params.DeliveryTime                ;
                pedido.DeliveryTimeReplace          = params.DeliveryTimeReplace         ;
                pedido.GPS                     = params.GPS                    ;
                // pedido.City                         = params.City                        ;
                pedido.Address                      = params.Address                     ;
                if (params.AddedBy) {
                    pedido.AddedBy                  = params.AddedBy                     ;
                }
                pedido.Bodega                       = params.Bodega                      ;
                pedido.State                        = params.State                       ;
                pedido.Total                        = params.Total                       ;
                pedido.SubTotal                     = params.SubTotal                    ;
                pedido.TotalDiscount                = params.TotalDiscount               ;
                pedido.TotalProdSell                = params.TotalProdSell               ;
                pedido.TotalProdFree                = params.TotalProdFree               ;
                pedido.SendCost                     = params.SendCost                    ;
                pedido.Comments                     = params.Comments                    ;
                pedido.FindedBy                     = params.FindedBy                    ;
                pedido.ContactedBy                  = params.ContactedBy                 ;
                if (params.DeliveredBy) {
                    pedido.DeliveredBy                  = params.DeliveredBy                 ;
                }
                pedido.Deliverer                    = params.Deliverer                 ;
                pedido.Image                        = params.Image                       ;
                pedido.Active                       = params.Active                      ;
                
                if (req.usuario.id) {
                    pedido.Created.By = req.usuario.id    ;
                }

                pedido.save((ErrorSave, stored) => {
                    if (ErrorSave) return res.status(500).send({Message: 'Error while save Pedido', ErrorSave});
                    if (stored && stored != null) {
                        return res.status(201).send({Message: 'Pedido Saved!', Pedido: stored});
                    } else return res.status(404).send({Message: 'Error: Pedido Saved null'});
                });
            } else {
                return res.status(500).send({
                    Message: 'Error creating Pedido, Required Fields: ' + noNumber + ' ' + noDelTime + ' ' + noCity + ' ' + noAdd + ' ' + noTot + ' ' + noConta + ' ' + noDelv + ' ' + noPers + ' ' + noGPS + ' ' + noState
                })
            }
        })
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = Pedido.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = Pedido.find()
        Query.populate({
            path: 'Created.By Updated.By AddedBy Bodega Client Deliverer DeliveredBy',
            populate: {
                path: 'Persona City',
                populate: {
                    path: 'Canton',
                    populate: {
                        path: 'Provincia'
                    }
                }
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', Pedidos: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Pedido.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Pedido Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Pedido Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Pedido Updated succeful!', Pedido: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Pedido.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Pedido Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Pedido Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Pedido Deleted succeful!', Pedido: Updated});
        });
    }
    const Usuario = require('../model/usuario.model');
    // Safe Delete
    function SafeDelete (req, res) {
        const Id = req.body.id;
        const userId = req.usuario.id;
        const Password = req.body.Password;
        Usuario.findOne({_id: userId, Active: true}).exec(
            (Error, usuario) => {
                if (Error) return res.status(500).send({Message: 'Error al obtener los datos del usuario'});
                if (usuario) {
                    Bcrypt.compare(Password, usuario.Password, (ErrorPassword, check) => {
                        if (!check ||ErrorPassword) return res.status(403).send({Message: 'Error en la Contraseña'});
                        if (check) {
                            Pedido.findByIdAndDelete(Id).exec(
                                (error, deleted) => {
                                    if (error) return res.status(500).send({Message: 'Error al Borrar el Pedido'});
                                    if (!deleted) return res.status(404).send({Message: 'Error, no se pudo borrar el pedido o no se encontro'});
                                    return res.status(200).send({Message: 'Pedido Deleted', status: 200});
                                }
                            )
                        }
                    })
                }
            }
        )
    } 
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete,
    SafeDelete
}