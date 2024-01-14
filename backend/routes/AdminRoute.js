const express = require('express');
const AdminController = require("../controllers/AdminController");


const AdminRouter = express();

AdminRouter.get("/get5Month", AdminController.getOrderBy5Month);

AdminRouter.get("/getBestSelling", AdminController.getBestSellingProducts);

AdminRouter.get("/getUsers", AdminController.getAllUser);

AdminRouter.post("/updateUser", AdminController.updateUser);

AdminRouter.get("/loadUnseen/:id", AdminController.loadUnSeen);

AdminRouter.patch("/changeToSeen", AdminController.changetoSeen);

AdminRouter.post("/getMonthLyIncome", AdminController.getMonthLyIncome);

AdminRouter.route("/statistic").post(AdminController.orderStatisticByMonth);

AdminRouter.get("/deleteJunkData", AdminController.deleteJunkData);

AdminRouter.get("/deleteExpiresVoucher", AdminController.deleteExpiresVoucher);

module.exports = AdminRouter;