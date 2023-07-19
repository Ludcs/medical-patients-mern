const express = require('express');
const ProfessionalModel = require('../models/Professional');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');

const router = express.Router();

//*REGISTER:

router.post(
  '/register',
  [
    check('name', 'The name is required').notEmpty(),
    check('lastName', 'The last name is required').notEmpty(),
    check('email', 'The email is not valid').isEmail(),
    check('password', 'The password must have at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    try {
      const {name, lastName, email, password} = req.body;

      //si esta ya registrado
      const professionalRegistered = await ProfessionalModel.findOne({email});
      if (professionalRegistered) {
        return res.status(400).json({msg: 'El profesional ya existe'});
      }

      //si no esta registrado
      const hashedPassword = await bcrypt.hash(password, 10);

      const newProfessional = new ProfessionalModel({
        name,
        lastName,
        email,
        password: hashedPassword,
      });
      await newProfessional.save();

      res.json({msg: 'Profesional registrado exitosamente', newProfessional});
    } catch (error) {
      console.log(error);
      res.json({msg: 'No se pudo registrar el profesional'});
    }
  }
);

//*LOGIN

router.post(
  '/login',
  [
    check('email', 'The email is not valid').isEmail(),
    check('password', 'The password must have at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    try {
      const {email, password} = req.body;
      const professionalLogin = await ProfessionalModel.findOne({email});
      if (!professionalLogin) {
        return res.status(400).json({msg: 'El profesional no existe'});
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        professionalLogin.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({msg: 'El password no es correcto'});
      }

      //si se encuentra el email y si el password es valido, generar el jwt
      const token = jwt.sign(
        {id: professionalLogin._id},
        process.env.SECRETJWT
      );

      res.json({
        msg: 'Inicio de sesion exitoso',
        token,
        professionalID: professionalLogin._id,
        professionalName: `${professionalLogin.name} - ${professionalLogin.lastName}`,
      });
    } catch (error) {
      console.log(error);
      res.json({msg: 'No se pudo iniciar sesion'});
    }
  }
);

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.SECRETJWT, (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  router,
  verifyToken,
};
