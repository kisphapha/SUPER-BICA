const config = require("../config/db.config")
const sql = require("mssql");

const getAllOrder = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request().query(
            `SELECT o.Id AS OrderId, o.StaffID, s.Name AS Staff_name,
            u.Name,o.OrderDate,o.Status_Paid, o.UserID,
            o.Status_Shipping, o.Point,
            CONCAT(a.SoNha,', ', a.PhuongXa,', ',a.QuanHuyen,', ', a.TinhTP ) AS Address,
            o.PhoneNumber, o.TotalAmount, o.UpdateAt, o.Note 
            FROM dbo.Orders o
            JOIN [User] u ON u.Id = o.UserID
            LEFT JOIN [User] s ON s.Id = o.StaffID
            JOIN UserAddress a ON a.ID = o.AddressID
            ORDER BY o.Id desc`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};
const getOrderByUserId = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input("ID",sql.Int, id)
            .query(
            `select *
             from Orders
             where Orders.UserID = @ID 
             order by Id DESC`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};
const getOrderById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            SELECT o.*, v.discount, v.MaxAmount
            FROM Orders o
            LEFT JOIN Voucher v ON v.Id = o.VoucherID
            WHERE o.Id = @Id
        `;
        const result = await poolConnection.request()
            .input('Id', sql.Int, id)
            .query(query);
        return result.recordset[0];
    } catch (error) {
        console.log("error: ", error);
    }
};
const addOrderToDB = async (UserID, OrderDate, PaymentDate, ShippingAddress, PhoneNumber, Note, TotalAmount, PaymentMethod, VoucherID, point, Items) => {
    try {
        let poolConnection = await sql.connect(config);
        const voucherIDValue = VoucherID !== "" ? VoucherID : null;
        const orderQuery = `
            INSERT INTO dbo.Orders
            (
                [UserID],
                [OrderDate],
                [PaymentDate],
                [AddressID],
                [PhoneNumber],
                [Note],
                [TotalAmount],
                [PaymentMethod],
                [IsDeleted],
                [UpdateAt],
                [View_Status],
                [Status_Shipping],
                [Status_Paid],
                [VoucherID],
                [Point]
            )
            OUTPUT INSERTED.Id
            VALUES
            (
                @UserID,
                @OrderDate,
                @PaymentDate,
                @AddressID,
                @PhoneNumber,
                @Note,
                @TotalAmount,
                @PaymentMethod,
                0,
                GETDATE(),
                0,
                N'Chờ duyệt',
                N'Chưa Thanh Toán',
                @VoucherID,
                @Point
            );
        `;
        const orderRequest = poolConnection.request()
            .input('UserID', sql.Int, UserID)
            .input('OrderDate', sql.DateTime, OrderDate)
            .input('PaymentDate', sql.DateTime, PaymentDate)
            .input('AddressID', sql.Int, ShippingAddress)
            .input('PhoneNumber', sql.NVarChar, PhoneNumber)
            .input('Note', sql.NVarChar, Note)
            .input('TotalAmount', sql.Int, TotalAmount)
            .input('PaymentMethod', sql.NVarChar, PaymentMethod)
            .input('Point', sql.Int, point)
            .input('VoucherID', sql.Int, voucherIDValue)

        const orderResult = await orderRequest.query(orderQuery);
        const orderId = orderResult.recordset[0].Id;
        let oldPrice
        if (Items && Items.length > 0) {
            for (const item of Items) {
                const itemQuery = `
                INSERT INTO OrderItem(
                    ProductId,
                    OrdersId,
                    Quantity,
                    Price,
                    CreatedAt
                ) VALUES (
                    @ProductId,
                    @OrderId,
                    @Quantity,
                    @Price,
                    GETDATE()
                );

                UPDATE Products
                SET Stock = Stock - @Quantity
                WHERE Id = @ProductId
            `;
                const itemRequest = poolConnection.request()
                    .input('ProductId', sql.Int, item.id)
                    .input('OrderId', sql.Int, orderId)
                    .input('Quantity', sql.Int, parseInt(item.quantity))
                    .input('Price', sql.Int, parseInt(item.price));
                await itemRequest.query(itemQuery);
            }
            oldPrice = await getOldPrice(orderId)
        } else {
            oldPrice = TotalAmount
        }
        await poolConnection.request()
            .input('id', orderId)
            .input('oldPrice', sql.Int, oldPrice)
            .query(
                ` UPDATE dbo.Orders
              SET DiscountRate =  (TotalAmount * 1.00) / (@oldPrice * 1.00)
              WHERE id = @id
              `
            )
        return orderId;
    } catch (error) {
        console.log("error: ", error);
    }
};
const changeStatus_Paid = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('id', id)
        .query(
            ` UPDATE dbo.Orders
              SET Status_Paid = N'Đã thanh toán', View_Status = 0, PaymentDate = GETDATE() 
              WHERE id = @id
              `
        )
    } catch (e) {
        console.log("error: ", e);
    }
};
const updateStaffId = async (id, staffId) => {
    try {
        let poolConnection = await sql.connect(config);
        await poolConnection.request()
            .input('id', id)
            .input('staffId', staffId)
            .query(
                ` UPDATE dbo.Orders
                  SET StaffId = @staffId
                  WHERE id = @id
              `
            )
    } catch (e) {
        console.log("error: ", e);
    }
};
const getAllOrderItemByOrderID = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            SELECT oi.Id AS ItemID, p.Id, p.Name, oi.CreatedAt, oi.Price, oi.Quantity, i.Url, c.name AS Shape, p.discount,
                r.name AS material, oi.refund_status, oi.refund_reason, oi.refund_type, oi.refund_phone
            FROM OrderItem oi
            INNER JOIN Orders o ON o.Id = oi.OrdersId
            INNER JOIN Products p ON oi.ProductId = p.id
            INNER JOIN Category c ON p.Category = c.Id
            INNER JOIN Material r ON p.materialId = r.Id
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            WHERE o.Id = @OrderId;
        `;
        const result = await poolConnection.request()
            .input('OrderId', sql.Int, id)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};
const loadUnSeen = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('id', id)
        .query(
            `SELECT * FROM dbo.Orders 
             WHERE UserID = @id`

        )
        return result.recordset;
    } catch (error) {
        console.log("Error: " , error)
    }
}
const changeToSeen = async(id, userid) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('id', id)
        .input('userid', userid)
        .query(
            ` 
            UPDATE dbo.Orders
            SET View_Status = 1
            WHERE UserID = @userid
            AND Id = @id
            `
        )
    } catch (error) {
        console.log("error: ", error);
    }
}
const pieChartData = async() => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .query(
            ` 
            SELECT Category.name, SUM(dbo.OrderItem.Quantity)AS Cages FROM dbo.Category
            JOIN dbo.Products
            ON Products.Category = Category.Id
            JOIN dbo.OrderItem
            ON OrderItem.ProductId = Products.Id
            GROUP BY Category.name
            `
        )
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const getFeedbackByOrderItem = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('id', id)
            .query(
                ` 
           SELECT f.*,u.Name, u.Picture, r.Name AS ReplierName, r.Picture AS ReplierPicture
            FROM Feedback f
             INNER JOIN OrderItem oi ON f.OrderItemId = oi.Id
             LEFT JOIN [User] r ON r.Id = f.Replier
             INNER JOIN [Orders] o ON o.Id = oi.OrdersId
             INNER JOIN [User] u ON u.Id = o.UserId
             WHERE f.OrderItemId = @id
            `
            )
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const verifyOrderItemAndUserId = async (userId, id, mode) => {
    try {
        let queryStr = 
            `SELECT oi.Id FROM 
	        OrderItem oi, Orders o
	        WHERE OrdersId = @id 
		        AND o.Id = oi.OrdersId
		        AND o.UserID = @userId`
        if (mode == 1) {
            queryStr =
                `SELECT oi.Id FROM 
	            OrderItem oi, Orders o
	            WHERE oi.Id = @id 
		            AND o.Id = oi.OrdersId
		            AND o.UserID = @userId`
        }
        let poolConnection = await sql.connect(config);
        const response = await poolConnection.request()
            .input('id', sql.Int, id)
            .input('userId', sql.Int, userId)
            .query(queryStr)
        return response.recordset
    } catch (e) {
        console.log("error: ", e);
    }
};
const cancelOrder = async (id) => {
    try {
        let poolConnection = await sql.connect(config);console.log(id)
        await poolConnection.request()
            .input('id', sql.Int, id)
            .query(
                `  DELETE FROM RefundImage WHERE OrderItemId IN (SELECT Id FROM OrderItem WHERE OrdersId = @id)
                    DELETE FROM OrderItem
                    WHERE OrdersId = @id
                    DELETE FROM dbo.Orders
                    WHERE Id = @id
              `
            )
    } catch (e) {
        console.log("error: ", e);
    }
};
const createRefundRequest = async (Id, reason, phone, type, urls) => {
    try {
        let poolConnection = await sql.connect(config);
        await poolConnection.request()
            .input('reason', sql.NVarChar, reason)
            .input('phone', sql.VarChar, phone)
            .input('type', sql.Int, type)
            .input('Id', sql.Int, Id)
            .query(
                `       
                UPDATE OrderItem
                SET refund_reason = @reason, refund_phone = @phone, refund_type = @type, refund_status = N'Chờ duyệt'
                WHERE Id = @Id
                `
        )
        urls.map(async (url) => {
            await poolConnection.request()
                .input('Url', sql.NVarChar, url)
                .input('Id', sql.Int, Id)
                .query(
                    `        
                INSERT INTO RefundImage (Url,OrderItemId, CreatedAt)
                VALUES (@Url,@Id, CURRENT_TIMESTAMP)
                `
                )
        })   
    } catch (e) {
        console.log("error: ", e);
    }
};

const getRefundOrderItems = async (staffId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('Id', sql.Int, staffId)
            .query(
            `SELECT oi.Id AS ItemID,  oi.OrdersId, oi.Price, oi.Quantity,o.UpdateAt, s.Name AS Staff_name, o.StaffID, o.DiscountRate,
	            p.Id, p.Name, oi.CreatedAt, i.Url, c.name AS Shape, p.discount, r.name AS material, u.Name AS User_name, u.Email,
	            oi.refund_status, oi.refund_reason, oi.refund_type, oi.refund_phone, o.TotalAmount
            FROM OrderItem oi
            INNER JOIN Orders o ON oi.OrdersId = o.Id
            INNER JOIN [User] u ON o.UserId = u.Id
            LEFT JOIN [User] s ON o.StaffID = s.Id
            INNER JOIN Products p ON oi.ProductId = p.id
            INNER JOIN Category c ON p.Category = c.Id
            INNER JOIN Material r ON p.materialId = r.Id
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            WHERE refund_status IS NOT NULL AND o.StaffID = @Id`
        );
        

        const data = result.recordset;
        if (data.length > 0) {
            await Promise.all(data.map(async (item) => {
                item.images = [];
                const images_res = await getRefundOrderImages(item.ItemID);
                if (images_res.length > 0) {
                    images_res.forEach((image) => {
                        item.images.push(image);
                    });
                }
            }));
        }
        return data
    } catch (error) {
        console.log("error: ", error);
    }
};
const getRefundOrderImages = async (Id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('Id', sql.Int, Id)
            .query(
                `SELECT *
                FROM RefundImage
                WHERE OrderItemId = @Id`
            );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};
const getOldPrice = async (Id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('Id', sql.Int, Id)
            .query(`
                SELECT o.Id, SUM(p.Price * (100 - p.discount) / 100 * oi.Quantity) AS old_price
                FROM OrderItem oi, Products p, Orders o
                WHERE oi.OrdersId = o.Id
	                AND oi.ProductId = p.Id
	                AND o.Id = @Id
                GROUP BY o.Id
            `)
        return result.recordset[0].old_price;
    } catch (error) {
        console.log("error: ", error);
    }
};

const splitOrderItem = async (itemId, UserID, OrderDate, PaymentDate, ShippingAddress,PhoneNumber, Note, TotalAmount, PaymentMethod, VoucherID, point, staffId, oldOrder) => {
    try {
        const newOrder = await addOrderToDB(UserID, OrderDate, PaymentDate, ShippingAddress,
            PhoneNumber, Note, TotalAmount, PaymentMethod, VoucherID, point, [])
        let poolConnection = await sql.connect(config);
        await poolConnection.request()
            .input('Id', sql.Int, itemId)
            .input('orderId', sql.Int, newOrder)
            .input('staffId', sql.Int, staffId)
            .input('oldId', sql.Int, oldOrder)
            .query(
                `UPDATE OrderItem
                SET OrdersId = @orderId, refund_status = N'Đang chờ Shipper'
                WHERE Id = @Id

                UPDATE Orders
                SET Status_paid = N'Đã thanh toán', StaffID = @staffId, Status_shipping =  N'Đang chuẩn bị'
                WHERE Id = @orderId`
        );
        const oldOrderItems = await getAllOrderItemByOrderID(oldOrder)
        if (oldOrderItems.length == 0) {
            await cancelOrder(oldOrder)
        } else {
            await updateTotalAmount(oldOrder,TotalAmount)
        }
        return newOrder
    } catch (error) {
        console.log("error: ", error);
    }
};
const setRefundStatus = async (id, status) => {
    try {
        let poolConnection = await sql.connect(config);
        if (status) {
            await poolConnection.request()
                .input('id', id)
                .input('status',sql.NVarChar, status)
                .query(
                    ` UPDATE OrderItem
                    SET refund_status = @status
                    WHERE id = @id
              `
                )
        } else {
            await poolConnection.request()
                .input('id', id)
                .query(
                    ` UPDATE OrderItem
                    SET refund_status = NULL
                    WHERE id = @id
              `
                )
        }       
    } catch (e) {
        console.log("error: ", e);
    }
}
const updateTotalAmount = async (id, total) => {
    let poolConnection = await sql.connect(config);
    await poolConnection.request()
        .input('total', sql.Int, total)
        .input('oldId', sql.Int, id)
        .query(
            `
            UPDATE Orders
            SET TotalAmount = TotalAmount - @total
            WHERE Id = @oldId`
        );
}

module.exports = {
    getAllOrder,
    getOrderById,
    addOrderToDB,
    changeStatus_Paid,
    getAllOrderItemByOrderID,
    getOrderByUserId,
    loadUnSeen,
    changeToSeen,
    pieChartData,
    getFeedbackByOrderItem,
    updateStaffId,
    verifyOrderItemAndUserId,
    cancelOrder,
    createRefundRequest,
    getRefundOrderItems,
    getRefundOrderImages,
    getOldPrice,
    splitOrderItem,
    setRefundStatus,
    updateTotalAmount
}