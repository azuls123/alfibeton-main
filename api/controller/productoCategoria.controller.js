'use strict'

const ProductoCategoria = require('../model/productoCategoria.model');
const Moment = require('moment');
// funciones
    // CREATE
    function Create(req, res) {
        const params = req.body;
        const productoCategoria = new ProductoCategoria();
        let noOr = "", noProd = "", noCat = "";
        if (!params.Order) noOr = "[Order]"; if (!params.Categoria) noProd = "[Category]"; if (!params.Producto) noCat = "[Product]";
        
        if(params.Order && params.Categoria && params.Producto){
            productoCategoria.Order              = params.Order              ;   
            productoCategoria.Categoria       = params.Categoria               ;
            productoCategoria.Producto        = params.Producto              ;
            productoCategoria.Created.By = req.usuario.id    ;

            productoCategoria.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save ProductoCategoria'});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'ProductoCategoria Saved!'});
                } else return res.status(404).send({Message: 'Error: ProductoCategoria Saved null'});
            });
        } else {
            return res.status(500).send({
                Message: 'Error creating ProductoCategoria, Required Fields: ' + noOr + ' ' + noProd + ' ' + noCat
            })
        }
    }

    // READ
    function Read(req, res) {
        const Active     = req.params.active;
        let Query        = ProductoCategoria.find({Active});

        if (!Active || (Active != 'true' && Active != 'false')) Query = ProductoCategoria.find()
        Query.populate({
            path: 'Created.By Updated.By Categoria Producto',
            populate: {
                path: 'Persona'
            }

        }).exec((Error, Response) => {
            if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
            if (!Response) return res.status(404).send({Message: 'Collection not Found'});
            if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
            return res.status(200).send({Message: 'Query Succeful', ProductoCategoria: Response});
        })
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        ProductoCategoria.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during ProductoCategoria Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during ProductoCategoria Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'ProductoCategoria Updated succeful!', ProductoCategoria: Updated});
        });
    }

    // DELETE
    function Delete(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        // if(req.body.Active == 'true') req.body.Active = 'false' ; if (req.body.Active == 'false') {req.body.Active = 'true'}

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        ProductoCategoria.findByIdAndUpdate(Id, req.body, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during ProductoCategoria Delete!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during ProductoCategoria Delete!!!, Server does not response'}); 
            return res.status(200).send({Message: 'ProductoCategoria Deleted succeful!', ProductoCategoria: Updated});
        });
    }
    function clean (req, res) {
        const id = req.params.id;
        ProductoCategoria.remove({Producto: id}, (Error, Deleted) => {
            if (Error) return res.status(500).send({Message: 'Error while deleting colors', Error});
            if (!Deleted) return res.status(404).send({Message: 'Server Does not Response!'});
            return res.status(200).send({Message: 'Category Deleted Succefully!', Deleted});
        })
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update,
    Delete,
    clean
}