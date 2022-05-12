const express = require("express");

const gatewayController = require("../controllers/gatewayController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();

router.get("/", userAuthMW, gatewayController.getGateways);

router.get("/getCredentials", gatewayController.getCredentials);

router.get("/getGatewayInfo/:gatewaySerial", gatewayController.getGatewayInfo);

router.get("/:gatewayId", gatewayController.getGateway);

router.post("/", gatewayController.postGateway);

router.put("/:gatewayId", userAuthMW, gatewayController.putGateway);

router.delete("/:gatewayId", userAuthMW, gatewayController.deleteGateway);

module.exports = router;
