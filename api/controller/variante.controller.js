'use strict'

const Variante = require('../model/variante.model');
const Moment = require('moment');

// funciones
    // CREATE
    function Create(req,res) {
        const params = req.body;
        const variante = new Variante();
        if (params.Variante && params.Producto) {
            variante.Variante = params.Variante;
            variante.Producto = params.Producto;
            variante.Created.By = req.usuario._id;
            variante.save((ErrorSave, stored)=>{
                if (ErrorSave) return res.status(500).send({Message: 'Error while saving Variante', Variante: stored});
                if (!stored) return res.status(404).send({Message: 'Error, Cannot save Variante'});
                return res.status(201).send({Message: 'Variante Saved!', Variante: stored}); 
            })
        } else {
            return res.status(404).send({Message: 'Error, All params required'});
        }
    }
    // READ
    function Read(req, res) {
        const Active    = req.params.active;
        let Query       = Variante.find({Active})
        if (!Active || (Active != 'true' && Active != 'false')) Query = Variante.find();
        Query.populate({
            path: 'Producto Created.By Updated.By By',
            populate: {
                path: 'Persona '
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful',  Variantes: Response});
        })
        
    }
    // UPDATE
    function Update(req, res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update = req.body;

        Variante.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error While update Variante'});
            if (!Updated) return res.status(404).send({Message: 'Error, DB Not responding'});
            return res.status(200).send({Message: 'collection Updated!', Variante: Updated});
        })
    }
    // DELETE
    function Delete (req, res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update = req.body;

        Variante.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error While Deleting Variant'});
            if (!Updated) return res.status(404).send({Message: 'Error, DB Not responding'});
            return res.status(200).send({Message: 'collection Deleting!', Variante: Updated});
        })
    }
    function cleanVariants (req, res) {
        const id = req.params.id;
        ColorProducto.findByIdAndDelete(id, (Error, Deleted) => {
            if (Error) return res.status(500).send({Message: 'Error while deleting colors', Error});
            if (!Deleted) return res.status(404).send({Message: 'Server Does not Response!'});
            return res.status(200).send({Message: 'Variant Deleted Succefully!', Deleted});
        })
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete,
    cleanVariants
}