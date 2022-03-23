const express = require("express");

const gatewayController = require("../controllers/gatewayController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();

router.get("/", userAuthMW, gatewayController.getGateways);

router.get("/:gatewayId", userAuthMW, gatewayController.getGateway);

router.put("/:gatewayId", userAuthMW, gatewayController.putGateway);

router.delete("/:gatewayId", userAuthMW, gatewayController.deleteGateway);

module.exports = router;
