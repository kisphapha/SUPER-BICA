const express = require("express");
const ShipperController = require("../controllers/ShipperController");
const authentication = require('../authentication')
const shipperRoutes = express.Router();

shipperRoutes.get("/order", authentication.verifyServerKey, ShipperController.getAllOrder)
shipperRoutes.get("/custom", authentication.verifyServerKey, ShipperController.getCustomOrders)
shipperRoutes.post("/change", authentication.verifyServerKey, ShipperController.changeShippingState);
shipperRoutes.post("/delivery", authentication.verifyServerKey, ShipperController.updateDelivery);


module.exports = shipperRoutes;
