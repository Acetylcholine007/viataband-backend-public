const express = require("express");
const { body } = require("express-validator/check");

const nodeController = require("../controllers/nodeController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();
const Node = require("../models/Node");

router.get("/", userAuthMW, nodeController.getNodes);

router.get("/:nodeId", userAuthMW, nodeController.getNode);

router.post(
  "/",
  userAuthMW,
  [
    body("nodeSerial")
      .trim()
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (value.length !== 2) {
          return Promise.reject("Node serial should be 2 character String");
        }
        return Node.findOne({ nodeSerial: value }).then((nodeDoc) => {
          if (nodeDoc) {
            return Promise.reject("Node with the same serial already exist");
          }
        });
      }),
  ],
  nodeController.postNode
);

router.put("/:nodeId", userAuthMW, nodeController.putNode);

router.delete("/:nodeId", userAuthMW, nodeController.deleteNode);

module.exports = router;
