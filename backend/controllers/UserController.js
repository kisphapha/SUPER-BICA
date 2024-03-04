const User = require("../models/User");
const authentication = require('../authentication')


const getAllUser = async (req, res) => {
    try {
        const response = await User.getAllUser();
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const response = await User.getUserByEmail(req.params.email);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        //const response = {}
        const credential = req.body.credential
        const userData = await User.checkLogin(credential);
        if (!userData) {
            res.json(null)
        } else {
            res.json(userData);
        }
        //const checkLogined = authentication.tokenList.filter((element) => element.id == userData.Id)[0]
        //let token
        //response.userData = userData
        //if (!checkLogined) {
        //    token = generateToken(20)
        //    response.token = token
        //    authentication.tokenList.push({ id: userData.Id, role: userData.Role, token: token })
        //}
        //else {
        //    token = checkLogined.token
        //    response.token = token
        //}
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const logout = async (req, res) => {
    //
    //const { id } = req.body;

    //const index = authentication.tokenList.findIndex((element) => element.id === id);
    //if (index !== -1) {
    //    authentication.tokenList.splice(index, 1);
    //}

    res.json({ message: "Logged out!" });
}

const newUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const picture = req.body.picture;
        const secretKey = req.body.secretKey;
        res.json({ message: "done" });
        await User.newUser(name, email, picture, secretKey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const id = req.body.id
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const dob = req.body.dob;
        const response = await User.updateUser(name, id,email, phone, dob);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getPointForUser = async (req, res) =>{
    try {
        const id = req.body.id;
        const point = req.body.point;

        const updatedUser = await User.getPointForUser(id, point);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const filterUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const dob = req.body.dob;
        const role = req.body.role;
        const status = req.body.status;
        const lower_point = req.body.lower_point;
        const upper_point = req.body.upper_point;
        const create = req.body.create;
        const page = req.body.page;
        const response = await User.filterUser(name, email, phone, dob, lower_point, upper_point, create, status, role, page);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addVoucher = async(req, res) => {
    try{
        const UserID = req.body.id;
        const discount = req.body.discount;
        const maxAmount = req.body.maxAmount;
        const response = await User.addVoucher(UserID, discount, maxAmount);
        res.status(200).json({message: "success"});
    }catch (error) {
        res.status(500).json({message: error.message});
    }

}

const updateVoucher = async (req, res) => {
    try {
        const Id = req.body.Id;

        await User.updateVoucher(Id);
        res.status(200).json({ message: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


const getVoucherByUserID = async(req, res) => {
    try {
        const userID= req.params.id;

        const response = await User.getVoucherByUserID(userID);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const exchangePoint = async (req, res) => {
    try {
        const userID = req.body.id;
        const point = req.body.point;

        const response = await User.exchangePoint(userID, point);
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const replyFeedBack = async (req, res) => {
    try {
        const id = req.body.id;
        const ReplyContent = req.body.ReplyContent;
        const Replier = req.body.Replier;

        const response = await User.replyFeedBack(id, ReplyContent, Replier);
        res.status(200).json({message: "success"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }

}

const addNotifications = async (req, res) => {
    try {
        const content = req.body.content;
        const userId = req.body.id;

        const response = await User.addNotifications(content, userId);
        res.status(200).json({message: "success"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const loadNotifications = async (req, res) => {
    try {
        const id = req.params.id;

        const response = await User.loadNotifications(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteExpiredVoucher = async (req, res) => {
    try {
        const response = await User.deleteExpriedVoucher();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUser,
    getUserByEmail,
    newUser,
    updateUser,
    getPointForUser,
    filterUser,
    addVoucher,
    getVoucherByUserID,
    exchangePoint,
    replyFeedBack,
    addNotifications,
    loadNotifications,
    updateVoucher,
    login, logout,
    deleteExpiredVoucher
}