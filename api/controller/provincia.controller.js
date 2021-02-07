'use strict'

const Provincia = require('../model/provincia.model');
const Canton = require('../model/canton.model');
const Parroquia = require('../model/parroquia.model');
const Moment = require('moment');
// funciones
    // CREATE
    function Create(req, res) {
        let params = req.body;
        let provincia = new Provincia();
        let noNa = "", noDes = "", noColor = "";
        if (!params.Name) noNa = "[Name]"; if (!params.Canton) noDes = "[Canton]";
        
        if(params.Name && !(params._id && params._id != '')){
            provincia.Name               = params.Name               ;
            // provincia.Created.By         = req.usuario.id            ;

            provincia.save((ErrorSave, stored) => {
                if (ErrorSave) return res.status(500).send({Message: 'Error while save Provincia'});
                if (stored && stored != null) {
                    return res.status(201).send({Message: 'Provincia Saved!', Provincia: stored});
                } else return res.status(404).send({Message: 'Error: Provincia Saved null'});
            });
        } 
        else if (params.Name && params._id) {
            // params.Updated.By = req.usuario.id;
            // params.Updated.At = Moment().unix();
            // new: true hace que envie los datos despues de actualizar y no el estado anterior
            return res.status(200).send({Message: 'Provincia Already Exists', Provincia: params});
            // Provincia.findByIdAndUpdate(params._id, params, {new: true}, (Error, Updated) => {
            //     if (Error) return res.status(500).send({Message: 'Error during Provincia Update!!', Error});
            //     if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Provincia Update!!!, Server does not response'}); 
            // });
        } 
        else {
            return res.status(500).send({
                Message: 'Error creating Provincia, Required Fields: ' + noNa + ' ' + noDes + ' ' + noColor
            })
        }
    }

    // READ
    async function Read(req, res) {
        const Active     = req.params.active;
        // let Query        = Provincia.find({Active});

        // if (!Active || (Active != 'true' && Active != 'false')) Query = Provincia.find()
        // Query.populate({
        //     path: 'Created.By Updated.By',
        //     populate: {
        //         path: 'Persona'
        //     }

        // }).exec((Error, Response) => {
        //     if (Error) return res.status(500).send({Message: 'Internal Server Error', Error});
        //     if (!Response) return res.status(404).send({Message: 'Collection not Found'});
        //     if (Response == null || Response == undefined) return res.status(200).send({Message: 'No Collections registered'});
        //     return res.status(200).send({Message: 'Query Succeful', Provincias: Response});
        // })
        var provincias = await Provincia.find().exec();
        var cantones = await Canton.find().exec();
        var parroquias = await Parroquia.find().exec();
        var ProvinciasArray = [];

        if (Active && (Active == 'true' || Active == 'false') ) {
            return res.status(200).send({Provincias: provincias, Cantones: cantones, Parroquias: parroquias});
        } 
        for (const provincia of provincias) {
            const provTemp = {
                _id: provincia._id,
                Name: provincia.Name,
                Cantones: [],
            }
            for (const canton of cantones) {
                const cantTemp ={
                    _id: canton._id,
                    Name: canton.Name,
                    Provincia: canton.Provincia,
                    Parroquias: []
                }
                for (const parroquia of parroquias) {
                    const parrTemp = {
                        _id: parroquia._id,
                        Name: parroquia.Name,
                        Canton: parroquia.Canton
                    }
                    if (parrTemp.Canton == cantTemp._id.toString()) cantTemp.Parroquias.push(parrTemp);
                }
                if (provTemp._id.toString() == cantTemp.Provincia) provTemp.Cantones.push(cantTemp);
            }
            ProvinciasArray.push(provTemp)            
        }
        return res.status(200).send({Provincias: ProvinciasArray});
        
    }

    // UPDATE
    function Update(req,res) {
        const Id = req.params.id;
        req.body.Updated.By = req.usuario.id;
        req.body.Updated.At = Moment().unix();
        const Update =req.body;

        // new: true hace que envie los datos despues de actualizar y no el estado anterior
        Provincia.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return res.status(500).send({Message: 'Error during Provincia Update!!', Error});
            if (!Updated || Updated == null) return res.status(404).send({Message: 'Error during Provincia Update!!!, Server does not response'}); 
            return res.status(200).send({Message: 'Provincia Updated succeful!', Provincia: Updated});
        });
    }
// exportaciones
module.exports = {
    Create,
    Read,
    Update
}