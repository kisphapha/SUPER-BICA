const Order = require("../models/Order");

const getAllOrder = async (req, res) => {
    try {
        const order = await Order.getAllOrder();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrderById = async (req, res) => {
    try {
        const products = await Order.getOrderById(req.params.id);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getOrderByUserId = async (req, res) => {
    try {
        const products = await Order.getOrderByUserId(req.params.id);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addOrderToDB = async (req, res) => {
    try {
        const UserID = req.body.UserID;
        const OrderDate = req.body.OrderDate;
        const PaymentDate = req.body.PaymentDate;
        const ShippingAddress = req.body.AddressID;
        const PhoneNumber = req.body.PhoneNumber;
        const Note = req.body.Note;
        const TotalAmount = req.body.TotalAmount;
        const PaymentId = req.body.PaymentId;
        const VoucherID = req.body.VoucherID;
        const Point = req.body.Point;
        const Items = req.body.Items;

        var id = await Order.addOrderToDB(UserID, OrderDate, PaymentDate, ShippingAddress, PhoneNumber, Note, TotalAmount, PaymentId, VoucherID, Point, Items);
        res.json({
            message: "done",
            orderid: id
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}
const splitOrderItem = async (req, res) => {
    try {
        const UserID = req.body.UserID;
        const OrderDate = req.body.OrderDate;
        const PaymentDate = req.body.PaymentDate;
        const ShippingAddress = req.body.AddressID;
        const PhoneNumber = req.body.PhoneNumber;
        const Note = req.body.Note;
        const TotalAmount = req.body.TotalAmount;
        const PaymentId = req.body.PaymentId;
        const VoucherID = req.body.VoucherID;
        const Point = req.body.Point;
        const itemId = req.body.ItemID;
        const staffId = req.body.StaffID;
        const oldOrder = req.body.oldOrder;

        const id = await Order.splitOrderItem(itemId, UserID, OrderDate, PaymentDate, ShippingAddress, PhoneNumber,
            Note, TotalAmount, PaymentId, VoucherID, Point, staffId, oldOrder);
        res.json({message: "done", orderId : id});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const getOrderItemByOrderID = async (req, res) => {
    try {
        const order = await Order.getAllOrderItemByOrderID(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const changeStatus_Paid = async (req, res) => {
    try {
        const order = await Order.changeStatus_Paid(req.params.id);
        res.json("success");
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const loadUnSeen = async (req, res) => {
    try {
        const order = await Order.loadUnSeen(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: e.message })
    }
}

const getFeedbackByOrderItem = async (req, res) => {
    try {
        const order = await Order.getFeedbackByOrderItem(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: e.message })
    }
}

const updateStaffId = async (req, res) => {
    try {
        await Order.updateStaffId(req.body.Id, req.body.staffId);
        res.json({ message: "done" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const pieChartData = async (req, res) => {
    try {
        const order = await Order.pieChartData();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

const cancelOrder = async (req, res) => {
    try {
        const response = await Order.verifyOrderItemAndUserId(req.params.id, req.params.orderId,0);
        if (response.length > 0) {
            await Order.cancelOrder(req.params.orderId);
            res.json({ message: "done" });
        } else {
            res.status(403).json({ message: "You are not the owner of this order" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createRefundRequest = async (req, res) => {
    try {
        const Id = req.body.itemId;
        const reason = req.body.reason;
        const urls = req.body.urls;
        const phone = req.body.phone;
        const type = req.body.type;
        const userId = req.body.id
        const response = await Order.verifyOrderItemAndUserId(userId, Id, 1);
        if (response.length > 0) {
            await Order.createRefundRequest(Id, reason, phone, type, urls);
            res.json({ message: "done" });
        } else {
            res.status(403).json({ message: "You are not the owner of this order" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}
const getRefundRequest = async (req, res) => {
    try {
        const Id = req.params.id;
        const response = await Order.getRefundOrderItems(Id);
        res.json(response)
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}
const setRefundStatus = async (req, res) => {
    try {
        await Order.setRefundStatus(req.body.Id, req.body.status);
        res.json({ message: "done" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateTotalAmount = async (req, res) => {
    try {
        await Order.updateTotalAmount(req.body.Id, req.body.total);
        res.json({ message: "done" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = {
    getAllOrder,
    getOrderById,
    addOrderToDB,
    getOrderItemByOrderID,
    getOrderByUserId,
    changeStatus_Paid,
    loadUnSeen,
    getFeedbackByOrderItem,
    updateStaffId,
    pieChartData,
    cancelOrder,
    createRefundRequest,
    getRefundRequest,
    splitOrderItem,
    setRefundStatus,
    updateTotalAmount
}
