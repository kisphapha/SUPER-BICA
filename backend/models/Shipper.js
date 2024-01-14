const config = require("../config/db.config");
const sql = require("mssql");

const changeShippingState = async(id, status) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
        .request()
        .input('Status_Shipping', sql.NVarChar, status)
        .input('id', sql.Int, id)
        .query(`
          UPDATE dbo.Orders
          SET Status_Shipping = @Status_Shipping, View_Status = 0, UpdateAt = GETDATE()
          WHERE id = @id;
        `);
      
      return result.recordset;
      
    }catch (error) {
        console.log("error: ", error);
    }
}
const updateDelivery = async (orderId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('OrderID', sql.Int, orderId)
            .query(`
                UPDATE CustomCage
                SET Status_shipping = N'Đã giao',Updated_at = CURRENT_TIMESTAMP
                WHERE ID = @OrderID  

                UPDATE CustomCage
                SET Status_Paid = N'Đã thanh toán', Payment_date = CURRENT_TIMESTAMP
                WHERE ID = @OrderID  AND Payment_date IS NULL
        `);

        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}

module.exports = {
    changeShippingState,
    updateDelivery
}