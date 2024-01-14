const express = require("express");
const NotificationController = require("../controllers/NotificationController")
const authentication = require("../authentication")

const notificationRouter = express.Router();
notificationRouter.delete("/:mode/:id", authentication.verifyServerKey, NotificationController.deleteNotification);
notificationRouter.get("/", authentication.staffAuthenToken, NotificationController.getSystemNotification);
notificationRouter.get("/:id", authentication.verifyServerKey, NotificationController.getNoficationByUserId);
notificationRouter.post("/", authentication.verifyServerKey, NotificationController.pushNotification);
notificationRouter.patch("/", authentication.verifyServerKey, NotificationController.updateContent);
notificationRouter.patch("/img", authentication.verifyServerKey, NotificationController.updateImage);
notificationRouter.patch("/seen", authentication.verifyServerKey, NotificationController.seen);



module.exports = notificationRouter;