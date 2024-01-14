const config = require("../config/db.config");
const sql = require("mssql");

const getNotifyByUser = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input("Id",sql.Int, id)
            .query(
            `SELECT *
                FROM Notification WHERE UserId = @Id
                ORDER BY Time_stamp DESC`
                
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const getSystemNotify = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input("Id", sql.Int, id)
            .query(
                `SELECT *
                FROM Notification WHERE UserId IS NULL
                ORDER BY Time_stamp DESC`
            );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const pushNotification = async (content,userId,RefId,RefUrl,RefPic) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input("content", sql.NVarChar, content)
            .input("userId", sql.Int, userId)
            .input("refId", RefId)
            .input("refUrl", sql.NVarChar, RefUrl)
            .input("refPic", sql.NVarChar, RefPic)
            .query(
                `INSERT INTO Notification (content, userId, RefId, RefUrl,RefPicture, View_status, Time_stamp)
                VALUES (@content,@userId,@refId,@refUrl,@refPic, 0, CURRENT_TIMESTAMP)`
            );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const updateContent = async (id, content, userId, refUrl, refPicture) => {
    try {
        let poolConnection = await sql.connect(config);
        const check = await poolConnection.request()
            .input("id", id)
            .query(`
                SELECT * FROM Notification WHERE RefId = @id
            `)
        if (check.recordset.length > 0) {
            await poolConnection.request()
                .input("content", sql.NVarChar, content)
                .input("id", id)
                .query(
                    `UPDATE Notification
                SET content = @content, Time_stamp = CURRENT_TIMESTAMP, View_status = 0
                WHERE RefId = @id`
                );
        } else {
            await pushNotification(content,userId,id,refUrl,refPicture)
        }        
    } catch (error) {
        console.log("error: ", error);
    }
}
const updateImage = async (id, image) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input("image", sql.NVarChar, image)
            .input("id", id)
            .query(
                `UPDATE Notification
                SET RefPicture = @image, Time_stamp = CURRENT_TIMESTAMP, View_status = 0
                WHERE RefId = @id`
            );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const seen = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input("id", id)
            .query(
                `UPDATE Notification
                SET View_status = 1 WHERE Id = @id`
            );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const deleteNotification = async (id, mode) => {
    try {
        let queryString = "DELETE FROM Notification WHERE Id = @id"
        if (mode == 1) queryString = "DELETE FROM Notification WHERE RefId = @id"
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input("id", sql.VarChar, id)
            .query(queryString);
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
module.exports = {
    getNotifyByUser,
    getSystemNotify,
    pushNotification,
    updateContent,
    seen,
    deleteNotification,
    updateImage
};
