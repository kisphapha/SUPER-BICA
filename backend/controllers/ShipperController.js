const Order = require("../models/Order");
const Custom = require("../models/Custom");
const Shipper = require("../models/Shipper");

const getAllOrder = async (req, res) => {
    try {
        const order = await Order.getAllOrder();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getCustomOrders = async (req, res) => {
    try {
        const response = await Custom.getCustomOrders();
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const changeShippingState = async(req, res) => {
    try {
        const orderId = req.body.orderId;
        const status = req.body.status;
        await Shipper.changeShippingState(orderId, status);
        res.json({ message: "done" });
    }catch (e) {
        res.status(500).json({message: e.message})
    }
}
const updateDelivery = async (req, res) => {
    try {
        const orderId = req.body.orderId
        const response = await Shipper.updateDelivery(orderId);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    changeShippingState,
    updateDelivery,
    getAllOrder,
    getCustomOrders
}