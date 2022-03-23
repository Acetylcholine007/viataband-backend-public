const express = require("express");
const { body } = require("express-validator/check");

const patientController = require("../controllers/patientController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();

router.get("/", userAuthMW, patientController.getPatients);

router.get("/patientId", userAuthMW, patientController.getPatient);

router.put(
  "/:patientId",
  userAuthMW,
  [
    body("firstname").trim().not().isEmpty(),
    body("lastname").trim().not().isEmpty(),
    body("address").trim().not().isEmpty(),
    body("age").not().isEmpty(),
    body("contactNo").trim().not().isEmpty(),
    body("sex").not().isEmpty(),
  ],
  patientController.putPatient
);

module.exports = router;
