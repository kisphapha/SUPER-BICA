const config = require("../config/db.config");
const sql = require("mssql");

const getAllMaterial = async() => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
        .request()
        .query(`
          SELECT * FROM Material
          WHERE isDeleted = 0
          ORDER BY Name ASC
        `);
      
      return result.recordset;
      
    }catch (error) {
        console.log("error: ", error);
    }
}
const getMaterialForCustom = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .query(`
          SELECT * FROM Material
          WHERE isDeleted = 0 AND Allow_customize = 1
          ORDER BY Name ASC
        `);

        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const getMaterialByCate = async(cate) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('cate', sql.NVarChar, cate)
        .query(`
          SELECT * FROM Material WHERE Category = @cate AND isDeleted = 0
        `);
      
      return result.recordset;
      
    }catch (error) {
        console.log("error: ", error);
    }
}

const addMaterial = async (name, category, price, unit, customize) => {
    try {
        let poolConnection = await sql.connect(config);
        await poolConnection
            .request()
            .input('name', sql.NVarChar, name)
            .input('category', sql.NVarChar, category)
            .input('price', sql.Int, price)
            .input('unit', sql.NVarChar, unit)
            .input('Allow_customize', sql.Bit, customize)
            .query(`
            INSERT INTO Material (Name, Category, Price,Unit, Allow_customize, isDeleted)
            VALUES (@name, @category, @price, @unit, @Allow_customize, 0 )

        `);
        const result = await poolConnection
            .request()
            .query(`
                SELECT TOP 1 *
                FROM Material
                ORDER BY Id DESC
                `)               
        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const updateMaterial = async (id, name, category, price, unit, customize) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('category', sql.NVarChar, category)
            .input('price', sql.Int, price)
            .input('unit', sql.NVarChar, unit)
            .input('Allow_customize', sql.Bit, customize)
            .query(`
            UPDATE Material
            SET Name = @name, Category = @category, Price = @price, Unit = @unit, Allow_customize = @Allow_customize
            WHERE Id = @id
        `);
        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const deleteMaterial = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('id', sql.Int, id)
            .query(`
            UPDATE Material
            SET isDeleted = 1
            WHERE Id = @id
        `);
        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const filterMaterial = async (name, category, unit, customize, page) => {
    try {
        const perPage = 10;
        const poolConnection = await sql.connect(config);

        const conditions = [];
        if (category && category != 0) conditions.push(`Category LIKE N'%${category}%'`);
        if (name) conditions.push(`name LIKE '%${name}%'`);
        if (unit) conditions.push(`unit LIKE '%${unit}%'`);
        if (customize && customize != -1) conditions.push(`Allow_customize = ${customize ? 1 : 0}`);
        conditions.push('isDeleted = 0')

        const conditionString = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT *
            FROM [Material] 
            ${conditionString}
            ORDER BY name ASC
            OFFSET ${(page - 1) * perPage} ROWS
            FETCH NEXT ${perPage} ROWS ONLY;
        `;

        const result = await poolConnection.request().query(query);
        const json = { data: result.recordset };

        const linesQuery = `
            SELECT COUNT(*) AS Count
            FROM [Material] 
            ${conditionString}
        `;

        const linesResult = await poolConnection.request().query(linesQuery);
        json.lines = linesResult.recordset[0];
        return json;
    } catch (error) {
        console.log("error: ", error);
    }
}

module.exports = {
    getMaterialByCate,
    getAllMaterial,
    addMaterial,
    deleteMaterial,
    updateMaterial,
    filterMaterial,
    getMaterialForCustom
}