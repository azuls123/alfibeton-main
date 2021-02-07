'use strict'

const Producto = require('../model/producto.model');
const Moment = require('moment');
// funciones
    // CREATE
    function Create(req, res) {
        const params = req.body;
        const producto = new Producto();
        let noNa = "", noDes = "", noColor = "";
        if (!params.Name) noNa = "[Name]"; if (!params.Description) noDes = "[Description]"; if (!params.Color) noColor = "[Color]";
        
        if(params.Name && params.Description){
            producto.Description        = params.Description        ;   
            producto.Name               = params.Name               ;
            producto.Brand              = params.Brand              ;
            producto.Color              = params.Color              ;
            producto.Created.By = req.usuario.id    ;

            producto.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Producto'});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'Producto Saved!', Producto: stored});
                } else return res.status(404).send({Message: 'Error: Producto Saved null'});
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating Producto, Required Fields: ' + noNa + ' ' + noDes + ' ' + noColor
            })
        }
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = Producto.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = Producto.find()
        Query.populate({
            path: 'Created.By Updated.By',
            populate: {
                path: 'Persona'
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', Productos: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Producto.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Producto Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Producto Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Producto Updated succeful!', Producto: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Producto.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Producto Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Producto Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Producto Deleted succeful!', Producto: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete
}