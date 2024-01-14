const cron = require('node-cron');
const axios = require('axios');

const setupCronJob = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            const res = await axios.delete("http://localhost:3000/users/expired", {
                headers: {
                    Authorization: 'Bearer ' + process.env.SERVER_KEY
                }
            })
            if (res.data) {
                for (voucher of res.data) {
                    await axios.post('http://localhost:3000/notification/', {
                        userId: voucher.UserID,
                        content: `Rất tiếc Voucher ${voucher.discount} % của bạn đã hết hạn hôm nay, hãy dùng điểm đổi Voucher khác và sử dụng chúng khi còn có thể bạn nhé!`,
                        refId: voucher.ID + '',
                        refUrl: "/user/voucher",
                        refPic: "/src/image/icons/voucher.png"
                    }, {
                        headers: {
                            Authorization: 'Bearer ' + process.env.SERVER_KEY
                        }
                    })
                }
            }
        } catch (e) {
            console.log(e.message)
        }        
     });
};

module.exports = {
    setupCronJob,
};