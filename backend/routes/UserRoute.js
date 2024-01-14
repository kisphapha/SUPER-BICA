const express = require("express");
const UserController = require("../controllers/UserController");
const authentication = require('../authentication')

const userRouter = express.Router();
userRouter.get("/token", authentication.verifyLoggedIn, function (req, res) {
    res.json({ message: "valid" })
})

userRouter.delete("/expired", authentication.verifyServerKey, UserController.deleteExpiredVoucher);
userRouter.get("/", authentication.adminAuthenToken, UserController.getAllUser);
userRouter.post("/new", UserController.newUser);
userRouter.patch("/update", authentication.verifyUserToken, UserController.updateUser);
userRouter.get("/:email", UserController.getUserByEmail);
userRouter.post("/filter", authentication.adminAuthenToken, UserController.filterUser);
userRouter.post("/updatePoint", authentication.verifyServerKey, UserController.getPointForUser);
userRouter.post("/addVoucher", authentication.verifyServerKey, UserController.addVoucher);
userRouter.get("/getVoucher/:id", authentication.verifyUserToken, UserController.getVoucherByUserID);
userRouter.post("/exchangePoint", authentication.verifyServerKey, UserController.exchangePoint);
userRouter.post("/replyFeedback", authentication.staffAuthenToken, UserController.replyFeedBack);
userRouter.post("/addNotifications", authentication.verifyServerKey,  UserController.addNotifications);
userRouter.post("/updateVoucher", authentication.verifyServerKey, UserController.updateVoucher);
userRouter.post("/login", UserController.login);
userRouter.post("/logout", authentication.verifyUserToken, UserController.logout);
userRouter.get("/loadNotifications/:id", authentication.verifyUserToken, UserController.loadNotifications);


module.exports = userRouter;