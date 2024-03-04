const config = require("../config/db.config");
const sql = require("mssql");
const jwt = require("jsonwebtoken")

const getAllUser = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request().query(
            `SELECT * FROM [dbo].[User]`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

const getUserByEmail = async (email) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            SELECT Id, Name, Email, Picture, DateOfBirth,PhoneNumber, Role, Point, Status, CreatedAt
            FROM [dbo].[User]
            WHERE email = @Email;
        `;
        const result = await poolConnection.request()
            .input('Email', sql.NVarChar, email)
            .query(query);
        return result.recordset[0];
    } catch (error) {
        console.log("error: ", error);
    }
};
const checkLogin = async (credential) => {
    try {
        const user = jwt.decode(credential);
        let poolConnection = await sql.connect(config);
        const query = `
            SELECT Id, Name, Email, Picture, DateOfBirth, PhoneNumber, Role, Point, Status, CreatedAt
            FROM [dbo].[User]
            WHERE email = @Email;
        `;
        const result = await poolConnection.request()
            .input('Email', sql.NVarChar, user.email)
            .query(query);
        return result.recordset[0] 
    } catch (error) {
        console.log("error: ", error);
    }
};

const newUser = async (name, email, picture, secretKey) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            INSERT INTO [User] (Name, email, picture, Role, point, Status, CreatedAt, SecretKey) 
            VALUES (@Name, @Email, @Picture, 'User', 0, 'Active', GETDATE(), @SecretKey);
        `;
        await poolConnection.request()
            .input('Name', sql.NVarChar, name)
            .input('Email', sql.NVarChar, email)
            .input('Picture', sql.NVarChar, picture)
            .input('SecretKey', sql.NVarChar, secretKey)
            .query(query);
    } catch (error) {
        console.log("error: ", error);
    }
};

const updateUser = async (name, id, email, phone, dateOfBirth) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            UPDATE [User]
            SET Name = @Name, PhoneNumber = @Phone, DateOfBirth = @DateOfBirth
            WHERE Id = @Id;
        `;
        await poolConnection.request()
            .input('Name', sql.NVarChar, name)
            .input('Phone', sql.NVarChar, phone)
            .input('DateOfBirth', sql.NVarChar, dateOfBirth)
            .input('Id', sql.Int, id)
            .query(query);
        return getUserByEmail(email);
    } catch (error) {
        console.log("error: ", error);
    }
};

const getPointForUser = async(id, point) => {
    try {
        let poolConnection = await sql.connect(config);
        const response = await poolConnection.request()
        .input('id', id)
        .input('point', point)
        .query(`
            UPDATE dbo.[User]
            SET Point = Point + @point 
            WHERE Id = @id

            SELECT *
            FROM [dbo].[User]
            WHERE Id = @id;
        `)
        return response.recordset[0]
    } catch (error) {
        console.log("error: ", error);
    }
}

const filterUser = async (name, email, phone, dob, lower_point, upper_point, create, status, role, page) => {
    try {
        const perPage = 10;
        const poolConnection = await sql.connect(config);

        const conditions = [];
        if (email) conditions.push(`email LIKE '%${email}%'`);
        if (name) conditions.push(`Name LIKE N'%${name}%'`);
        if (phone) conditions.push(`PhoneNumber LIKE N'%${phone}%'`);
        if (dob) conditions.push(`DateOfBirth LIKE '%${dob}%'`);
        if (role) conditions.push(`role LIKE '%${role}%'`);
        if (status && status !== "All") conditions.push(`Status = '${status}'`);
        if (upper_point) conditions.push(`Point <= ${upper_point}`);
        if (lower_point) conditions.push(`Point >= ${lower_point}`);
        if (create) conditions.push(`CreatedAt LIKE '%${create}%'`);

        const conditionString = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT u.Id,u.Name,u.Email,u.DateOfBirth,u.PhoneNumber,u.Role, u.Status, u.Point,u.CreatedAt, u.Picture, SUM(o.TotalAmount) AS Spent
            FROM [User] u 
            LEFT JOIN  Orders o ON o.UserID = u.Id
	            AND o.Status_Paid = N'Đã thanh toán'
            ${conditionString}
            GROUP BY u.Id, u.Name,u.Email,u.DateOfBirth, u.PhoneNumber, u.Role, u.Status, u.Point, u.CreatedAt,u.Picture
            ORDER BY Id ASC
            OFFSET ${(page - 1) * perPage} ROWS
            FETCH NEXT ${perPage} ROWS ONLY;
        `;

        const result = await poolConnection.request().query(query);
        const json = { data: result.recordset };

        const linesQuery = `
            SELECT COUNT(*) AS Count 
            FROM [User] 
            ${conditionString}
        `;

        const linesResult = await poolConnection.request().query(linesQuery);
        json.lines = linesResult.recordset[0];
        return json;
    } catch (error) {
        console.log("error: ", error);
    }
};

const  addVoucher = async (UserID, discount, maxAmount) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('UserID', UserID)
        .input('discount', discount)
            .input('maxAmount', sql.Int, maxAmount)
        .query(`
        insert into Voucher(
            [UserID],
            [discount],
            [CreatedAt],
            [UsedAt],
            [ExpireAt],
            [MaxAmount]
        )
        values(
            @UserID,
            @discount,
            GETDATE(),
            NULL,
            DATEADD(MONTH, 1, GETDATE()),
            @maxAmount
        )
        `)
    } catch (error) {
        console.log("error: ", error);
    }
}

const updateVoucher = async (Id) => {
    try {
        let poolConnection = await sql.connect(config);
        await poolConnection.request()
            .input('Id', Id)
            .query(`
        update Voucher
            set [UsedAt] = GETDATE()
        WHERE Id = @Id
        `)
    } catch (error) {
        console.log("error: ", error);
    }
}
const deleteExpriedVoucher = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const response = await poolConnection.request()
            .query(`
            SELECT *
            FROM Voucher
            WHERE UsedAt IS NULL AND ExpireAt <= CURRENT_TIMESTAMP          
        `)

        await poolConnection.request()
            .query(`
              DELETE FROM Voucher
            WHERE UsedAt IS NULL AND ExpireAt <= CURRENT_TIMESTAMP
            `)
        return response.recordset
    } catch (error) {
        console.log("error: ", error);
    }
}

const getVoucherByUserID = async (Id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('UserID', Id)
            .query(`
        select * from Voucher
        where UserID = @UserID
        `)
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}


const exchangePoint = async(UserID, Point) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('UserID', UserID)
        .input('Point', Point)
        .query(`
            UPDATE dbo.[User]
            SET Point = Point - @Point
            WHERE id = @UserID

            SELECT *
            FROM [dbo].[User]
            WHERE Id = @UserID;
        `)
        return result.recordset[0]
    } catch (error) {
        console.log("error: ", error);
    }
}

const replyFeedBack = async(id, ReplyContent, Replier) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('id', id)
        .input('ReplyContent', ReplyContent)
        .input('Replier', Replier)
        .query(`
            UPDATE dbo.Feedback
            SET ReplyContent = @ReplyContent , ReplyDate = GETDATE(), Replier = @Replier
            WHERE id =@id
        `)
    } catch (error) {
        console.log("error: ", error);
    }
}

const addNotifications = async(content, userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('content', content)
        .input('userId', userId)
        .query(`
        INSERT INTO dbo.Notification
        (
            content,
            userId
        )
        VALUES
        (   @content,
            @userId
            )
        `)
    } catch (error) {
        console.log("error: ", error);
    }
}

const loadNotifications = async (userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('userId', userId)
        .query(`
        SELECT * FROM dbo.Notification
	    WHERE userId = @userId
        `)
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

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
    checkLogin,
    deleteExpriedVoucher
};
