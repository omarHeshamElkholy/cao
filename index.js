const express = require("express");
const Joi = require('joi');
const Cst = require("./api/Cst")
const PBI = require("./api/PBI")

const helmet = require("helmet");
const morgan = require("morgan");


const app = express();

//MW

app.use(express.json());
app.use('/api/cst',Cst)
app.use('/api/pbi',PBI)
app.use(helmet()); // for headers

if (app.get('env') === 'development') {
    // app.use(logging);

    app.use(morgan('tiny')); // for logging
}




//port

const port = process.env.port || 3000

app.listen(port, ()=> console.log("server is running ...."));



