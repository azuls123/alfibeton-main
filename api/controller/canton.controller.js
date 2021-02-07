'use strict'

const Canton = require('../model/canton.model');
const Moment = require('moment');
// funciones
    // CREATE
    function Create(req, res) {
        let params = req.body;
        let canton = new Canton();
        let noNa = "", noDes = "", noColor = "";
        if (!params.Name) noNa = "[Name]";
        if (!params.Provincia) noDes = "[Provincia]";
        // console.log(params);
        if(params.Name && params.Provincia && !(params._id && params._id != '')){
            canton.Name               = params.Name               ;
            canton.Provincia          = params.Provincia          ;
            // canton.Created.By         = req.usuario.id            ;

            canton.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Canton'});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'Canton Saved!', Canton: stored});
                } else return res.status(404).send({Message: 'Error: Canton Saved null'});
            });
        } 
        else if(params.Name && params.Provincia && params._id) {
            // params.Updated.By = req.usuario.id;
            // params.Updated.At = Moment().unix();
    
            // new: true hace que envie los datos despues de actualizar y no el estado anterior
            return res.status(200).send({Message: 'Canton Already Exists!', Canton: params});
            // Canton.findByIdAndUpdate(params._id, params, {new: true}, (Error, Updated) => {
            //     if (Error) return res.status(500).send({Message: 'Error during Canton Update!!', Error});
            //     if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Canton Update!!!, Server does not response'}); 
            // });
        } 
        else {
            return res.status(500).send({
                Message: 'Error creating Canton, Required Fields: ' + noNa + ' ' + noDes + ' ' + noColor,
                Params: params
            })
        }
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = Canton.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = Canton.find()
        Query.populate({
            path: 'Created.By Updated.By',
            populate: {
                path: 'Persona Role '
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', Cantones: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Canton.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Canton Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Canton Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Canton Updated succeful!', Canton: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update
}