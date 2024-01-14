const Custom = require("../models/Custom");



const getItems = async (req, res) => {
    try {
        const type = req.params.type
        const response = await Custom.getItems(type);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const getAllItems = async (req, res) => {
    try {
        const response = await Custom.getAllItems();
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const getPricing = async (req, res) => {
    try {
        const response = await Custom.getPricing();
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const addCustomOrder = async (req, res) => {
    try {
        const response = await Custom.addCustomOrder(req.body);
        res.json({ customId: response });
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const updateCustomOrder = async (req, res) => {
    try {
        const response = await Custom.updateCustomOrder(req.body);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const getCustomOrderByUserId = async (req, res) => {
    try {
        const response = await Custom.getOrdersByUserId(req.params.id);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const getCustomOrderById = async (req, res) => {
    try {
        const id = req.params.id
        let json = {}
        json.general = await Custom.getGeneralById(id);
        json.hook = await Custom.getHookById(id);
        json.spokes = await Custom.getSpokeById(id);
        json.door = await Custom.getDoorById(id);
        json.top = await Custom.getTopById(id);
        json.bottom = await Custom.getBottomById(id);
        json.other = await Custom.getOtherInfoById(id);
        res.json(json)
    } catch (e) {
        res.status(500).json({ message: e.message })
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

const getCustomOrderByStaffId = async (req, res) => {
    try {
        const response = await Custom.getCustomOrderByStaffId(req.params.id);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const sendMessage = async (req, res) => {
    try {
        const message = req.body.message
        const orderId = req.body.orderId
        const staffId = req.body.id
        const response = await Custom.sendMessage(orderId,message,staffId);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const changeStatus = async (req, res) => {
    try {
        const status = req.body.status
        const orderId = req.body.orderId
        const staffId = req.body.id
        const final_price = req.body.final_price
        const final_time = req.body.final_time
        const response = await Custom.changeStatus(orderId, status, staffId, final_price, final_time);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const updateImage = async (req, res) => {
    try {
        const url = req.body.final_image
        const orderId = req.body.orderId
        const response = await Custom.updateImage(orderId, url);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const updatePayment = async (req, res) => {
    try {
        const addressID = req.body.addressID
        const orderId = req.body.orderId
        const voucherID = req.body.voucherID
        const phoneNumber = req.body.phoneNumber
        const method = req.body.method
        const point = req.body.Point
        const response = await Custom.updatePayment(orderId, addressID, voucherID, phoneNumber, method, point);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const updateVnpay = async (req, res) => {
    try {
        const orderId = req.body.orderId
        const response = await Custom.updateVnpay(orderId);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const cancelOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId
        const response = await Custom.cancelOrder(orderId);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId
        const response = await Custom.deleteOrder(orderId);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const addCustomMenu = async (req, res) => {
    try {
        const category = req.body.category
        const name = req.body.name
        const picture = req.body.picture
        const response = await Custom.addCustomMenu(name, category, picture);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const updateCustomMenu = async (req, res) => {
    try {
        const id = req.body.id
        const name = req.body.name
        const picture = req.body.picture
        const category = req.body.category
        const response = await Custom.updateCustomMenu(id, name, category, picture);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const deleteCustomMenu = async (req, res) => {
    try {
        const id = req.params.id
        const response = await Custom.deleteCustomMenu(id);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const filterCustomMenu = async (req, res) => {
    try {
        const name = req.body.name
        const page = req.body.page
        const category = req.body.category
        const response = await Custom.filterCustomMenu(name, category, page);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const updatePricing = async (req, res) => {
    try {
        const id = req.body.id
        const price = req.body.price
        const response = await Custom.updateCustomPrice(id, price);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
module.exports = {
    getItems,
    getAllItems,
    getPricing,
    addCustomOrder,
    updateCustomOrder,
    getCustomOrderById,
    getCustomOrderByUserId,
    getCustomOrders,
    getCustomOrderByStaffId,
    sendMessage,
    changeStatus,
    updateImage,
    updatePayment,
    updateVnpay,
    cancelOrder,
    deleteOrder,
    addCustomMenu,
    updateCustomMenu,
    deleteCustomMenu,
    filterCustomMenu,
    updatePricing
}