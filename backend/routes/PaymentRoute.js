const express = require("express");
let $ = require('jquery');
const request = require('request');
const moment = require('moment');

const paymentRouter = express.Router();
const axios = require     ("axios")
paymentRouter.post('/create_payment_url', function (req, res, next) {

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    let tmnCode = "RDM114MY";
    let secretKey = "EIJWFMARSXNWVZNSUKUHWOGELUYKPFBS";
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    let returnUrl;
    req.body.type != "Custom" ?
        returnUrl = "http://localhost:3000/payment/vnpay_return" : returnUrl = "http://localhost:3000/payment/vnpay_return_custom";
    let orderId = req.body.orderid;
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl +=  "?" + querystring.stringify(vnp_Params, { encode: false }) 
    console.log(vnpUrl)

    res.json({ url: vnpUrl })
    // res.redirect(vnpUrl)
});

paymentRouter.get('/vnpay_return', function (req, res, next) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = "RDM114MY";
    let secretKey = "EIJWFMARSXNWVZNSUKUHWOGELUYKPFBS";

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        // res.json({status: 'success'});
        axios.get(`http://localhost:3000/order/paidstatus/${vnp_Params['vnp_TxnRef']}`, {
            headers: {
                Authorization: 'Bearer ' + process.env.SERVER_KEY
            }
        })
        res.redirect("http://localhost:5000/user/purchase")
      } else {
        res.json({status: 'failed'}); 
      }
});
paymentRouter.get('/vnpay_return_custom', function (req, res, next) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = "RDM114MY";
    let secretKey = "EIJWFMARSXNWVZNSUKUHWOGELUYKPFBS";

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        // res.json({status: 'success'});
        axios.post(`http://localhost:3000/custom/vnpay/`, { orderId: vnp_Params['vnp_TxnRef'] }, {
            headers: {
                Authorization: 'Bearer ' + process.env.SERVER_KEY
            }
        })
        res.redirect("http://localhost:5000/user/customPurchase")
    } else {
        res.json({ status: 'failed' });
    }
});

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}



module.exports = paymentRouter;