'use strict'

const Persona = require('../model/persona.model');
const Moment = require('moment');
// funciones
    // CREATE
    function Create(req, res) {
        const params = req.body;
        const persona = new Persona();
        let noFN = "", noLN = "", noPh = "", noCity = "", noAddress = "";
        if (!params.FirstName) noFN = "[First Name]"; if (!params.LastName) noLN = "[Last Name]"; if (!params.Phone) noPh = "[Phone]";
        if (!params.City) noCity = "[City]"; if (!params.Address) noAddress = "[Address]";
        console.log(params.City);
        if(params.FirstName && params.LastName && params.Phone && params.Address ){
            persona.Ci          = params.Ci          ;   
            persona.FirstName   = params.FirstName   ;
            persona.LastName    = params.LastName    ;
            persona.Phone       = params.Phone       ; 
            // persona.City        = params.City        ; 
            persona.Address     = params.Address     ;
            persona.GPS     = params.GPS     ;
            persona.HasAccount  = params.HasAccount  ;
            persona.isDueno     = params.isDueno     ;
            if (req.usuario) {
                persona.Created.By = req.usuario.id    ;
            } 

            persona.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Persona'});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'Persona Saved!', Persona: stored});
                } else return res.status(404).send({Message: 'Error: Persona Saved null'});
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating Persona, Required Fields: ' + noFN + ' ' + noLN + ' ' + noPh + ' ' + noCity + ' ' + noAddress
            })
        }
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = Persona.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = Persona.find()
        Query.populate({
            path: 'Created.By Updated.By City',
            populate: {
                path: 'Persona Canton',
                populate: {
                    path: 'Provincia'
                }
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', Personas: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        var Update =req.body;
        Update.Updated.By = req.usuario.id;
        Update.Updated.At = Moment().unix();

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Persona.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Persona Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Persona Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Persona Updated succeful!', Persona: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Persona.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Persona Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Persona Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Persona Deleted succeful!', Persona: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete
}