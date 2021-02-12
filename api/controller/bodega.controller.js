'use strict'

const Bodega = require('../model/bodega.model');
const Moment = require('moment');

// funciones
    // CREATE
    function Create(req, res) {
       
        const params = req.body;
        const bodega = new Bodega();

        let noCi = "", noAdd = "", noPh = "", noCol = "", noName = "", noBy = "";

        if (!params.City) noCi = "[City]";if (!params.By) noBy = "[In Charge]"; if (!params.Address) noAdd = "[Address]"; if (!params.Phone) noPh="[Phone]"; if (!params.Color) noCol="[Color]"; if (!params.Name) noName="[Name]";
        if (params.Address && params.Phone && params.Name) {
            bodega.City       = 'Sin Uso'        ; 
            bodega.Address    = params.Address     ; 
            bodega.Name       = params.Name        ; 
            bodega.Phone      = params.Phone       ;
            if (params.By && params.By != '') {
                bodega.By         = params.By          ;
            }
            bodega.Color      = params.Color       ;
            bodega.GPS      = params.GPS       ;
            bodega.Created.By = req.usuario.id    ;
            bodega.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Bodega', ErrorSave});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'Bodega Saved!', Bodega: stored});
                } else return res.status(404).send({Message: 'Error: Bodega Saved null'});
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating Bodega, Required Fields: ' + noCi + ' ' + noAdd + ' ' + noPh + ' ' + noCol + ' ' + noName + ' ' + noBy
            })
        }

    }

    // READ
    function Read(req, res) {
        const Active    = req.params.active;
        let Query       = Bodega.find({Active});
        
        if (!Active || (Active != 'true' && Active != 'false')) Query = Bodega.find()
        Query.populate({
            path: 'Created.By Updated.By City By',
            populate: {
                path: 'Persona Canton',
                populate: {
                    path: 'Provincia City',
                    populate: {
                        path: 'Canton',
                        populate: {
                            path: 'Provincia'
                        }
                    }
                }
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful',  Bodegas: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update = req.body;
        if (Update.By == '') Update.By = null;
        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Bodega.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Bodega Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Bodega Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Bodega Updated succeful!', Bodega: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Bodega.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Bodega Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Bodega Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Bodega Deleted succeful!', Bodega: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete
}
