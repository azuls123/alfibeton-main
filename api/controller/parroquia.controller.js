'use strict'

const Parroquia = require('../model/parroquia.model');
const Moment = require('moment');
// funciones
    // CREATE
    function Create(req, res) {
        const params = req.body;
        const parroquia = new Parroquia();
        let noNa = "", noDes = "", noColor = "";
        if (!params.Name) noNa = "[Name]"; if (!params.Canton) noDes = "[Canton]";
        
        if(params.Name && params.Canton && !(params._id && params._id != '')){
            parroquia.Name               = params.Name               ;
            parroquia.Canton          = params.Canton          ;
            // parroquia.Created.By         = req.usuario.id            ;

            parroquia.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Parroquia'});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'Parroquia Saved!', Parroquia: stored});
                } else return res.status(404).send({Message: 'Error: Parroquia Saved null'});
            });
        } 
        else if (params.Name && params.Canton && params._id) {
            // params.Updated.By = req.usuario.id;
            // params.Updated.At = Moment().unix();
            // new: true hace que envie los datos despues de actualizar y no el estado anterior
            return res.status(200).send({Message: 'Parroquia Already Exists!', Parroquia: params});
            // Parroquia.findByIdAndUpdate(params._id, params, {new: true}, (Error, Updated) => {
            //     if (Error) return res.status(500).send({Message: 'Error during Parroquia Update!!', Error});
            //     if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Parroquia Update!!!, Server does not response'}); 
            // });
        } 
        else {
            return res.status(500).send({
                Message: 'Error creating Parroquia, Required Fields: ' + noNa + ' ' + noDes + ' ' + noColor
            })
        }
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = Parroquia.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = Parroquia.find()
        Query.populate({
            path: 'Created.By Updated.By',
            populate: {
                path: 'Persona Role '
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', Parroquias: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Parroquia.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Parroquia Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Parroquia Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Parroquia Updated succeful!', Parroquia: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update
}