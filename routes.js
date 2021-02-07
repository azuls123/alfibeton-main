'use strict'

const Express = require('express');
const BodyParser = require('body-parser');


const App = Express();

const path = require('path');
const ServerHTTP = require('http').Server(App);
const io = require('socket.io')(ServerHTTP);

// let Message = require('./api/model/message.model');

// Cargar Rutas

const BodegaRoutes = require('./Api/routes/bodega.routes');
const CategoriaRoutes = require('./Api/routes/categoria.routes');
const EmpresaRoutes = require('./Api/routes/empresa.routes');
const IngresoRoutes = require('./Api/routes/ingreso.routes');
const KardexRoutes = require('./Api/routes/kardex.routes');
const ListaIngresoRoutes = require('./Api/routes/listaIngreso.routes');
const ListaPedidoRoutes = require('./Api/routes/listaPedido.routes');
// const MessageRoutes             = require('./Api/routes/message.routes');
const PedidoRoutes = require('./Api/routes/pedido.routes');
const PersonaRoutes = require('./Api/routes/persona.routes');
const ProductoRoutes = require('./Api/routes/producto.routes');
const ProductoCategoriaRoutes = require('./Api/routes/productoCategoria.routes');
const StockRoutes = require('./Api/routes/stock.routes');
const UsuarioRoutes = require('./Api/routes/usuario.routes');
const VarianteRoutes = require('./Api/routes/variante.routes');
const ProvinciaRoutes = require('./Api/routes/provincia.routes');
const ParroquiaRoutes = require('./Api/routes/parroquia.routes');
const CantonRoutes = require('./Api/routes/canton.routes');
const CompareListRoutes = require('./Api/routes/compareList.routes');
// const cors = require('cors');
// const corsOptions = {
//     origin: 'http://localhost:4200',
//     credentials: true,
// }
// App.use(cors(corsOptions));


// middlewares
// body parser starts
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());
// body parser ends

// configuraciones
// Configuracion para intercambio de recursos de origenes cruzados CORS //
App.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});



// cors

// Ruta Externa [FrontEnd]
// App.use(Express.static(path.join(__dirname, 'client')));
App.use('/', Express.static('client', { redirect: false }));

// Rutas Internas

App.use('/bodega', BodegaRoutes);
App.use('/categoria', CategoriaRoutes);
App.use('/empresa', EmpresaRoutes);
App.use('/ingreso', IngresoRoutes);
App.use('/kardex', KardexRoutes);
App.use('/lista-ingreso', ListaIngresoRoutes);
App.use('/lista-pedido', ListaPedidoRoutes);
// App.use('/message', MessageRoutes);
App.use('/pedido', PedidoRoutes);
App.use('/persona', PersonaRoutes);
App.use('/producto', ProductoRoutes);
App.use('/producto-categoria', ProductoCategoriaRoutes);
App.use('/stock', StockRoutes);
App.use('/usuario', UsuarioRoutes);
App.use('/variante', VarianteRoutes);
App.use('/provincia', ProvinciaRoutes);
App.use('/parroquia', ParroquiaRoutes);
App.use('/canton', CantonRoutes);
App.use('/compare-list', CompareListRoutes);

// Ruta de Pruebas
App.get('/test', (req, res) => {
    res.status(200).send({
        message: 'Servidor corriendo Correctamente!',
        check: true
    })
});

App.get('*', function (req, res, next) {
    res.sendFile(path.resolve('client/index.html'));
})

let myMessages = [];
const Message = require('./api/model/message.model');
// const { Message } = require('./client_dev/src/models/message.model');
async function getMessages(socket) {
    myMessages = await Message.find().populate({
        path: 'To From',
        populate: {
            path: 'Persona'
        }
    }).exec();
    return myMessages;
}
io.on('connection', async function (socket) {

    socket.on('send-message', function (data) {
        console.log('Conexion establecida');
        let NewMessage = new Message();
        // NewMessage.To = '';
        // if (data && data.Message) {
        NewMessage.Message = data.Message;
        if (data.From) {
            NewMessage.From = data.From;
        }
        if (data.To) {
            NewMessage.To = data.To
        }
        NewMessage.save((error, stored) => {
            getMessages(socket).then((MyMessages) => {
                // console.log(MyMessages);
                socket.emit('text-event', MyMessages);
                socket.broadcast.emit('text-event', MyMessages);
                socket.emit('first-event', MyMessages);
                socket.broadcast.emit('first-event', MyMessages);
            });
        });
        
    })
    socket.on('get-message', function (data) {
        getMessages(socket).then((MyMessages) => {
            // console.log(MyMessages);
            socket.emit('text-event', MyMessages);
            socket.broadcast.emit('text-event', MyMessages);
            socket.emit('first-event', MyMessages);
            socket.broadcast.emit('first-event', MyMessages);
        });
    })
})

ServerHTTP.listen(3000, function () {
    console.log('listening on localhost:3000');
});

// const mongo = require('mongodb').MongoClient;
// const client = require('socket.io').listen(3000).sockets;
// client.on('connection', function (){
// //    let chat = db.collection('chats');

//    sendStatus = function(s) {
//        socket.emit('status',s);
//    }
// });
// salida
module.exports = App;