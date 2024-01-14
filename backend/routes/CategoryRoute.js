const express = require("express");
const CategoryController = require("../controllers/CategoryController")
const authentication = require('../authentication')

const  categoryRouter = express.Router();
categoryRouter.get("/", CategoryController.getAll);
categoryRouter.get("/:id", CategoryController.getACategory);
categoryRouter.post("/update", authentication.adminAuthenToken, CategoryController.updateCategory)
categoryRouter.delete("/delete/:id", authentication.adminAuthenToken, CategoryController.deleteCategory);
categoryRouter.post("/add", authentication.adminAuthenToken, CategoryController.addCategory);



module.exports = categoryRouter;