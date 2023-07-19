const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectionDB = require('./db/connection');
// const authProfessionalRouter = require('./routes/professionals');
const {router} = require('./routes/professionals');
const patientsRouter = require('./routes/patients');

//Ejecutables
const app = express();
const port = process.env.PORT;

//Database
connectionDB();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
  })
);

//Routes
app.use('/auth', router);
app.use('/patients', patientsRouter);

//Listen on
app.listen(port, () => console.log(`SERVER ON PORT: ${port}`));
