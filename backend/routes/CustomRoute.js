const express = require("express");
const CustomController = require("../controllers/CustomController")
const authentication = require('../authentication')


const customRouter = express.Router();
customRouter.get("/", authentication.staffAuthenToken, CustomController.getCustomOrders);
customRouter.get("/staff/:id", authentication.staffAuthenToken, CustomController.getCustomOrderByStaffId);
customRouter.get("/pricing", CustomController.getPricing);
customRouter.get("/order/:id", authentication.verifyServerKey, CustomController.getCustomOrderById);
customRouter.get("/user/:id", authentication.verifyUserToken, CustomController.getCustomOrderByUserId);
customRouter.get("/allItems", CustomController.getAllItems)
customRouter.get("/:type", CustomController.getItems)
customRouter.post("/", authentication.verifyUserToken, CustomController.addCustomOrder)
customRouter.post("/message", authentication.verifyUserToken, authentication.staffAuthenToken, CustomController.sendMessage);
customRouter.post("/status", authentication.verifyUserToken, authentication.staffAuthenToken, CustomController.changeStatus);
customRouter.post("/image", authentication.staffAuthenToken, CustomController.updateImage);
customRouter.post("/pay", authentication.verifyUserToken, CustomController.updatePayment);
customRouter.post("/vnpay", authentication.verifyServerKey, CustomController.updateVnpay);
customRouter.patch("/", authentication.verifyUserToken, CustomController.updateCustomOrder);
customRouter.patch("/cancel", authentication.verifyUserToken, CustomController.cancelOrder);
customRouter.delete("/:id/:orderId", authentication.verifyUserToken, CustomController.deleteOrder);

customRouter.post("/menu/filter", CustomController.filterCustomMenu);
customRouter.post("/menu", authentication.adminAuthenToken, CustomController.addCustomMenu);
customRouter.patch("/menu", authentication.adminAuthenToken, CustomController.updateCustomMenu);
customRouter.delete("/menu/:id", authentication.adminAuthenToken, CustomController.deleteCustomMenu);

customRouter.patch("/pricing", authentication.adminAuthenToken, CustomController.updatePricing);

module.exports = customRouter;