const express = require("express");
const MaterialController = require("../controllers/MaterialController")
const authentication = require("../authentication")

const  materialRouter = express.Router();
materialRouter.get("/", MaterialController.getAllMaterial);
materialRouter.get("/custom", MaterialController.getMaterialForCustom);
materialRouter.get("/:Cate", MaterialController.getMaterialByCate);
materialRouter.post("/", authentication.adminAuthenToken, MaterialController.addMaterial);
materialRouter.patch("/", authentication.adminAuthenToken, MaterialController.updateMaterial);
materialRouter.delete("/:id", authentication.adminAuthenToken, MaterialController.deleteMaterial);
materialRouter.post("/filter", MaterialController.filterMaterial);



module.exports = materialRouter;