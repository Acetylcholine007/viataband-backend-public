const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/User");
const Gateway = require("../models/Gateway");
const userController = require("../controllers/userController");
const gatewayController = require("../controllers/gatewayController");

const router = express.Router();

router.post(
  "/user/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Minimum Password length: 5"),
    body("firstname")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter First Name"),
    body("lastname")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter Last Name"),
  ],
  userController.signup
);

router.post(
  "/user/login",
  [
    body("email").isEmail().trim().not().isEmpty(),
    body("password").trim().not().isEmpty(),
  ],
  userController.login
);

router.post(
  "/gateway/signup",
  [
    body("serialNumber").trim().not().isEmpty(),
    body("password").trim().isLength({ min: 5 }),
  ],
  gatewayController.signup
);

router.post(
  "/gateway/login",
  [
    body("serialNumber").trim().not().isEmpty(),
    body("password").trim().not().isEmpty(),
  ],
  gatewayController.login
);

module.exports = router;
