const express = require("express");

const userController = require("../controllers/userController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();

router.get("/", userAuthMW, userController.getUsers);

router.get("/:userId", userAuthMW, userController.getUser);

router.put("/:userId", userAuthMW, userController.putUser);

router.delete("/:userId", userAuthMW, userController.deleteUser);

module.exports = router;
