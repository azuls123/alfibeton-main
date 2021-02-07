'use strict'

const Categoria = require('../model/categoria.model');
const Moment = require('moment');
// funciones
    // CREATE
    function Create(req, res) {
        const params = req.body;
        const categoria = new Categoria();
        let noNa = "", noDes = "", noColor = "";
        // console.log(params);
        if (!params.Name) noNa = "[Name]"; if (!params.Description) noDes = "[Description]";
        
        if(params.Name && params.Description){
            categoria.Description        = params.Description        ;   
            categoria.Name               = params.Name               ;
            categoria.Created.By = req.usuario.id    ;
            categoria.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Categoria'});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'Categoria Saved!'});
                } else return res.status(404).send({Message: 'Error: Categoria Saved null'});
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating Categoria, Required Fields: ' + noNa + ' ' + noDes 
            })
        }
    }
    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = Categoria.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = Categoria.find()
        Query.populate({
            path: 'Created.By Updated.By',
            populate: {
                path: 'Persona'
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', Categorias: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Categoria.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Categoria Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Categoria Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Categoria Updated succeful!', Categoria: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Categoria.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Categoria Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Categoria Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Categoria Deleted succeful!', Categoria: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete
}