const express = require('express');
const ProfessionalModel = require('../models/Professional');
const PatientModel = require('../models/Patient');
const {uploadImage, deleteImage} = require('../libs/cloudinary');
const fsExtra = require('fs-extra');
const {verifyToken} = require('./professionals');

const router = express.Router();

//GET - ALL PATIENTS FOR THE PROFESSIONAL WHO IS LOGIN
router.get('/homePatients', async (req, res) => {
  try {
    const professionalId = req.query.professionalID;
    const professional = await ProfessionalModel.findById(professionalId);

    if (!professional) {
      return res.status(404).json({error: 'Profesional no encontrado'});
    }

    const patients = await PatientModel.find({professional: professionalId});

    res.status(200).json(patients);
  } catch (error) {
    res
      .status(500)
      .json({error: 'Ha ocurrido un error al obtener los pacientes'});
  }
});

//GET - ALL IDS FOR URGENTS PATIENTS
router.get('/urgentPatientsIDs', async (req, res) => {
  try {
    const professional = await ProfessionalModel.findById(
      req.query.professionalID
    );

    res.json({urgentPatients: professional.mostUrgentPatients});
  } catch (error) {
    res.json({error: 'Ha ocurrido un error al obtener los pacientes'});
  }
});

//GET - ALL ENTIRE URGENTS PATIENTS
router.get('/entireUrgentPatients', async (req, res) => {
  try {
    const professional = await ProfessionalModel.findById(
      req.query.professionalID
    );

    const urgentPatients = await PatientModel.find({
      _id: {$in: professional.mostUrgentPatients},
    });
    res.json({urgentPatients});
  } catch (error) {
    res.json({error: 'Ha ocurrido un error al obtener los pacientes'});
  }
});

//GET - ONE PATIENT BY ID
router.get('/:professionalID/:patientID', async (req, res) => {
  const {professionalID, patientID} = req.params;

  try {
    const professional = await ProfessionalModel.findById(
      professionalID
    ).populate('patients');

    if (!professional)
      return res.status(404).json({error: 'Profesional no encontrado'});

    const patient = professional.patients.find((patient) =>
      patient.equals(patientID)
    );

    if (!patient) {
      return res
        .status(404)
        .json({error: 'Paciente no encontrado para este profesional'});
    }

    return res.json(patient);
  } catch (error) {
    console.error('Error al buscar paciente:', error);
    return res.status(500).json({error: 'Error del servidor'});
  }
});

// POST - REGISTER A NEW PATIENT
router.post('/registerPatient', verifyToken, async (req, res) => {
  try {
    const professionalID = req.body.professionalID;
    //Envio a cloudinary la img para que responda con public_id y secure_url de la image:
    let image;
    if (req.files.image) {
      const resImg = await uploadImage(req.files.image.tempFilePath);
      image = {
        url: resImg.secure_url,
        public_id: resImg.public_id,
      };
      await fsExtra.remove(req.files.image.tempFilePath);
    }

    const professional = await ProfessionalModel.findById(professionalID);

    const newPatient = new PatientModel({
      name: req.body.name,
      lastName: req.body.lastName,
      age: req.body.age,
      weight: req.body.weight,
      height: req.body.height,
      image: image,
      diagnostic: req.body.diagnostic,
      symptoms: req.body.symptoms,
      professional: req.body.professionalID,
    });

    professional.patients.push(newPatient);
    await professional.save();
    await newPatient.save();
    res
      .status(201)
      .json({msg: 'The patient was successfully registered', newPatient});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({error: 'An error occurred while registering the patient'});
  }
});

//PUT - SAVED A URGENT PATIENT
router.put('/urgentPatients', verifyToken, async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.body.patientID);
    const professional = await ProfessionalModel.findById(
      req.body.professionalID
    );

    professional.mostUrgentPatients.push(patient);

    await professional.save();

    res.json({urgentPatients: professional.mostUrgentPatients});
  } catch (error) {
    console.log(error);
    res.json({error: 'Ha ocurrido un error al guardar un paciente urgente'});
  }
});

//PUT - UPDATE PATIENT
router.put('/update/:professionalID/:patientID', async (req, res) => {
  try {
    const professionalID = req.params.professionalID;
    const patientID = req.params.patientID;

    //Verificamos si existe el professional para el id pasado
    const professional = await ProfessionalModel.findById(professionalID);
    if (!professional)
      return res.status(404).json({msg: 'Profesional no encontrado'});

    //Verificamos si el patient esta en el array de patients
    if (!professional.patients.includes(patientID))
      return res
        .status(404)
        .json({msg: 'Paciente no encontrado para este professional'});

    const updatedPatient = await PatientModel.findByIdAndUpdate(
      patientID,
      req.body,
      {new: true}
    );
    res.status(200).json(updatedPatient);
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: error.message});
  }
});

//DELETE A NOT URGENT PATIENT (from HOME)
router.delete('/deletePatient/:professionalID/:patientID', async (req, res) => {
  try {
    const patient = await PatientModel.findByIdAndDelete(req.params.patientID);
    const professional = await ProfessionalModel.findById(
      req.params.professionalID
    );

    if (!patient) return res.status(404).json({msg: 'Paciente no encontrado'});

    if (patient.image.public_id) {
      await deleteImage(patient.image.public_id);
    }

    professional.patients.pull(patient._id);
    //professional.mostUrgentPatients.pull(patient._id);
    await professional.save();

    res.status(204).json({msg: 'Paciente eliminado'});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: error.message});
  }
});

//DELETE A URGENT PATIENT (from URGENTPATIENTS)
router.delete(
  '/deleteUrgentPatient/:professionalID/:patientID',
  async (req, res) => {
    try {
      const patient = await PatientModel.findById(req.params.patientID);
      const professional = await ProfessionalModel.findById(
        req.params.professionalID
      );

      professional.mostUrgentPatients.pull(patient._id);
      await professional.save();

      res.status(204).json({msg: 'Paciente removido de la lista de urgentes!'});
    } catch (error) {
      console.log(error);
      res.status(500).json({msg: error.message});
    }
  }
);

module.exports = router;
