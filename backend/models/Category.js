const config = require("../config/db.config");
const sql = require("mssql");

const getAllCategory = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request().query(
            `SELECT c.id, c.name, c.imageUrl, c.Allow_customize
            FROM Category c
            LEFT JOIN Products p ON p.Category = c.id
            WHERE c.isHide = 'false'

            GROUP BY c.id, c.name, c.imageUrl, c.Allow_customize
            ORDER BY c.id;`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

const getACategory = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('id', id)
        .query(
            `SELECT * FROM Category WHERE id = @id`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

const updateCategory = async (name, imageUrl, Allow_Customize, id) => {
    try {
        let poolConnection = await sql.connect(config);
        const request = poolConnection.request()
            .input('Name', sql.NVarChar, name)
            .input('ImageUrl', sql.NVarChar, imageUrl)
            .input('AllowCustomize', sql.Bit, Allow_Customize)
            .input('Id', sql.VarChar, id);

        await request.query(`
            UPDATE dbo.Category
            SET Name = @Name, imageUrl = @ImageUrl, Allow_Customize = @AllowCustomize
            WHERE id = @Id
        `);
    } catch (error) {
        console.log("error: ", error);
    }
};

const deleteCategory = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const request = poolConnection.request()
            .input('Id', sql.VarChar, id);

        await request.query(`
            UPDATE dbo.Category
            SET isHide = 1
            WHERE id = @Id
        `);
    } catch (error) {
        console.log("error: ", error);
    }
}



const addCategory = async (Id, Name, imageU, Allow_Customize, isHide) => {
    try {
        let poolConnection = await sql.connect(config);
        const request = poolConnection.request()
            .input('Id', sql.VarChar, Id)
            .input('Name', sql.NVarChar, Name)
            .input('ImageUrl', sql.NVarChar, imageU)
            .input('AllowCustomize', sql.Bit, Allow_Customize)
            .input('IsHide', sql.Bit, isHide);

        await request.query(`
            INSERT INTO dbo.Category
            (
                [Id],
                [Name],
                [imageUrl],
                [Allow_Customize],
                [isHide]
            )
            VALUES
            (
                @Id,
                @Name,
                @ImageUrl,
                @AllowCustomize,
                @IsHide
            )
        `);
    } catch (error) {
        console.log("error: ", error);
    }
}

module.exports = {
    getAllCategory,
    updateCategory,
    deleteCategory,
    addCategory,
    getACategory
}