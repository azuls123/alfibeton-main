'use strict'

const Mongoose = require('mongoose');
const Routes = require('./routes')
const Port = 3800;

Mongoose.Promise = global.Promise;
Mongoose.connect('mongodb://localhost:27017/alfibeton', {
// Mongoose.connect('mongodb://localhost:27017/test', {
// Mongoose.connect('mongodb://localhost:27017/inventario', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
        .then(() => {
            console.log("Conexion a base de datos Exitosa");
            // servidor
            Routes.listen(Port, () => {
                console.log("Servidor corriendo en localhost:"+Port);
            });
        })
        .catch(err => console.error(err));
