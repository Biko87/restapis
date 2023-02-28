const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({path:'variables.env'});

// Cors permite que un cliente se conecte a otro servidor
const cors = require('cors');

// Conectar Mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('conectado a BD de mongodb')) 
.catch(e => console.log('error de conexión', e))


//crear servidor
const app = express();


// Habilitar Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Definir un dominio(s) para recibir las peticiones
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        // Revisa si la petición viene de un servidor que está en la lista blanca = whitelist
        const existe = whitelist.some( dominio => dominio === origin );
        if (existe) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}

// Habilitar Cors
app.use(cors(corsOptions));

// Rutas de la App
app.use('/', routes()); 

// Carpeta pública
app.use(express.static('uploads'));

const host = proccess.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

// Iniciar App
app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
});