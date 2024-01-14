const Notification = require("../models/Notification");


const getNoficationByUserId = async (req, res) => {
    try {
        const response = await Notification.getNotifyByUser(req.params.id);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const getSystemNotification = async (req, res) => {
    try {
        const response = await Notification.getSystemNotify();
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const pushNotification = async (req, res) => {
    try {
        const content = req.body.content
        const userId = req.body.userId
        const refId = req.body.refId
        const refUrl = req.body.refUrl
        const refPic = req.body.refPic
        const response = await Notification.pushNotification(content,userId,refId,refUrl,refPic);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const updateContent = async (req, res) => {
    try {
        const content = req.body.content
        const id = req.body.Id
        const userId = req.body.userId
        const refUrl = req.body.refUrl
        const refPic = req.body.refPic
       await Notification.updateContent(id, content, userId, refUrl, refPic);
        res.json({ message: "done" });
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const updateImage = async (req, res) => {
    try {
        const image = req.body.image
        const id = req.body.Id
        const response = await Notification.updateImage(id, image);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const seen = async (req, res) => {
    try {
        const id = req.body.Id
        const response = await Notification.seen(id);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const deleteNotification = async (req, res) => {
    try {
        const id = req.params.id
        const mode = req.params.mode
        const response = await Notification.deleteNotification(id, mode);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
module.exports = {
    getNoficationByUserId,
    getSystemNotification,
    updateContent,
    deleteNotification,
    seen,
    pushNotification,
    updateImage
}