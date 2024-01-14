const config = require("../config/db.config");
const sql = require("mssql");

const newAddress = async (city,district,ward,location,userid) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('location', sql.NVarChar, location)
            .input('ward', sql.NVarChar, ward)
            .input('district', sql.NVarChar, district)
            .input('city', sql.NVarChar, city)
            .input('userid', sql.Int, userid)
            .query(`
            INSERT INTO UserAddress (SoNha, PhuongXa, QuanHuyen, TinhTP, Userid)
            VALUES (@location, @ward, @district, @city, @userid);
            `);
      
      return result.recordset;
      
    } catch (error) {
        console.log("error", error);
    }
};

const getAddressOfUser = async (userid) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('userId', userid)
            .query(`SELECT * FROM UserAddress WHERE userId = @userId`);
        return result.recordset;
    } catch (error) {
        console.log("error", error);
    }
};

const updateAddress = async (id, location, ward, district, city) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('SoNha', location)
            .input('phuongxa', ward)
            .input('quanhuyen', district)
            .input('tinhtp', city)
            .input('id', id)
            .query(`
                UPDATE UserAddress
                SET SoNha = @SoNha, PhuongXa = @phuongxa, QuanHuyen = @quanhuyen, TinhTP = @tinhtp
                WHERE id = @id
            `);
        
        // Close the SQL connection
        poolConnection.close();

        return result; // Return the result of the query
    } catch (error) {
        console.log("error: ", error);
    }
}


const deleteAddress = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
        .request()
        .input('id', id)  // Use .input to specify the parameter avoid sql injection
        .query('DELETE FROM UserAddress WHERE id=@id');

    } catch (error) {
        console.log("error: ", error)
    }
}



module.exports = {
    newAddress,
    getAddressOfUser,
    updateAddress,
    deleteAddress
}