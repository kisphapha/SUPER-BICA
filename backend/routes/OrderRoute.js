const express = require("express");
const OrderController = require("../controllers/OrderController");
const authentication = require('../authentication')

const OrderRouter = express.Router();

// no parameter
OrderRouter.get("/", authentication.staffAuthenToken, OrderController.getAllOrder);
OrderRouter.get("/pieChartData", authentication.adminAuthenToken, OrderController.pieChartData);
OrderRouter.post("/addordertodb", authentication.verifyServerKey, OrderController.addOrderToDB);
OrderRouter.get("/list/:id", authentication.verifyServerKey, OrderController.getOrderItemByOrderID);
OrderRouter.get("/user/:id", authentication.verifyUserToken, OrderController.getOrderByUserId);
OrderRouter.get("/paidstatus/:id", authentication.verifyServerKey, OrderController.changeStatus_Paid);
OrderRouter.get("/loadUnseen/:id", authentication.verifyServerKey, OrderController.loadUnSeen);
OrderRouter.get("/:id", authentication.verifyServerKey, OrderController.getOrderById);
OrderRouter.get("/feedback/:id", OrderController.getFeedbackByOrderItem);
OrderRouter.get("/refund/:id", authentication.verifyUserToken, OrderController.getRefundRequest);
OrderRouter.post("/refund", authentication.verifyUserToken, OrderController.createRefundRequest);
OrderRouter.post("/split", authentication.verifyServerKey, OrderController.splitOrderItem);
OrderRouter.patch("/staff", authentication.verifyServerKey, OrderController.updateStaffId);
OrderRouter.patch("/clear", authentication.verifyServerKey, OrderController.setRefundStatus);
OrderRouter.patch("/total", authentication.verifyServerKey, OrderController.updateTotalAmount);
OrderRouter.delete("/:orderId/:id", authentication.verifyUserToken, OrderController.cancelOrder);


module.exports = OrderRouter;

