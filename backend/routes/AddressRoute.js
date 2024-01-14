const express = require("express");
const AddressController = require("../controllers/AddressController");
const authentication = require('../authentication')

const router = express.Router();
router.post("/new", authentication.verifyUserToken, AddressController.newAddress);
router.post("/edit", authentication.verifyUserToken, AddressController.updateAddress);
router.delete("/delete/:adrId/:id", authentication.verifyUserToken, AddressController.deleteAddress);
router.get("/:id", authentication.verifyUserToken, AddressController.getAddressOfUser);

module.exports = router; 