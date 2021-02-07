'use strict'

const Empresa = require('../model/empresa.model');
const Moment = require('moment');

// funciones
    // CREATE
    function Create(req, res) {
       
        const params = req.body;
        const empresa = new Empresa();
        // console.log(params);
        // let noCi = "", noAdd = "", noPh = "", noCol = "", noName = "", noBy = "";

        // if (!params.City) noCi = "[City]";if (!params.By) noBy = "[In Charge]"; if (!params.Address) noAdd = "[Address]"; if (!params.Phone) noPh="[Phone]"; if (!params.Color) noCol="[Color]"; if (!params.Name) noName="[Name]";
        if (params.RUC && params.Address && params.Name && params.Representante && params.Active) {
            empresa.RUC             = params.RUC             ;
            empresa.Address         = params.Address         ;
            empresa.Name            = params.Name            ;
            // empresa.City            = params.City            ;
            empresa.GPS            = params.GPS            ;
            // empresa.Bodega          = params.Bodega          ;
            // empresa.Admin           = params.Admin           ;
            empresa.Representante   = params.Representante   ;
            empresa.Active          = params.Active          ;
            empresa.Created.By = req.usuario.id    ;
            empresa.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Bodega'});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'Empresa Saved!', Empresa: stored});
                } else return res.status(404).send({Message: 'Error: Empresa Saved null'});
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating Empresa.'
            })
        }

    }

    // READ
    function Read(req, res) {
        const Active    = req.params.active;
        let Query       = Empresa.find({Active});
        
        if (!Active || (Active != 'true' && Active != 'false')) Query = Empresa.find()
        Query.populate({
            path: 'Admin Representante City Created.By Updated.By',
            populate: {
                path: 'Persona Canton City ',
                populate: {
                    path: 'City Provincia Canton',
                    populate: {
                        path: 'Provincia Canton',
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
            return res.status(200).send({Message: 'Query Succeful',  Empresas: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Empresa.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Empresa Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Empresa Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Empresa Updated succeful!', Empresa: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Empresa.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Empresa Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Empresa Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Empresa Deleted succeful!', Empresa: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete
}
