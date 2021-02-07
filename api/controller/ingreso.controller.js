'use strict'

const Ingreso = require('../model/ingreso.model');
const Moment = require('moment');
// funciones
    async function getNumberOfIngreso() {
        let temp = await Ingreso.find().exec();
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
        const ingreso = new Ingreso();
        getNumberOfIngreso().then((Number) => {
            // console.log(Number);
            params.Number = Number;
            if (params.Received.By && params.Received.By == '') params.Received.By = undefined;
            let  noRec = "", noAt='', noNumber = "", noBodega = '', noUns = '';
            if (!params.Number) noNumber = "[Number]"; if (!params.Bodega) noBodega = "[Bodega]";
            if( params.Number && params.Bodega && params.SuggestedDate && params.SuggestedTime ){
                ingreso.Number              = params.Number          ;
                ingreso.Units               = params.Units            ;
                // ingreso.Received            = params.Received           ;
                if (params.Received.By) {
                    ingreso.Received.By         = params.Received.By     ;
                }
                ingreso.Received.At         = params.Received.At     ;
                ingreso.Bodega              = params.Bodega           ;
                ingreso.SuggestedDate       = params.SuggestedDate           ;
                ingreso.SuggestedTime       = params.SuggestedTime           ;
                if (params.BodegaTraslado) {
                    ingreso.BodegaTraslado      = params.BodegaTraslado         ;
                }
                ingreso.Number      = params.Number         ;
                ingreso.Created.By  = req.usuario.id       ;
                ingreso.save((ErrorSave, stored) => {
                    if (ErrorSave) return res.status(500).send({Message: 'Error while save Ingreso', ErrorSave});
                    if (!stored) return res.status(404).send({Message: 'Error: Ingreso Saved null'});
                    return res.status(201).send({Message: 'Ingreso Saved!', Ingreso: stored});
                });
            } else {
                return res.status(500).send({
                    Message: 'Error creating Ingreso, Required Fields: ' + noUns  + ' ' + noRec + ' ' + noNumber + ' ' + noBodega + ' ' +noAt + ' '
                })
            }
        })
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = Ingreso.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = Ingreso.find()
        Query.populate({
            path: 'Created.By Updated.By Bodega BodegaTraslado',
            populate: {
                path: 'Persona Producto City',
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
            return res.status(200).send({Message: 'Query Succeful', Ingresos: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Ingreso.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Ingreso Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Ingreso Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Ingreso Updated succeful!', Ingreso: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id; 
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();    
        // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}


        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Ingreso.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Ingreso Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Ingreso Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Ingreso Deleted succeful!', Ingreso: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete
}