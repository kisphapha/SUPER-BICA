const config = require("../config/db.config");
const sql = require("mssql");

const getItems = async(type) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('type', sql.NVarChar,type)
        .query(`
            SELECT * FROM CustomMenu WHERE Category = @type AND isShowed = 1
        `);
      
      return result.recordset;
      
    }catch (error) {
        console.log("error: ", error);
    }
}
const getAllItems = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .query(`
            SELECT * FROM CustomMenu WHERE isShowed = 1
        `);

        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const getPricing = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .query(`
            SELECT * FROM CustomPricing
        `);

        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const addCustomOrder = async (order) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Name', sql.NVarChar, order.Name)
            .input('UserID', sql.Int, order.id)
            .input('Length', sql.Int, order.Length)
            .input('Width', sql.Int, order.Width)
            .input('Height', sql.Int, order.Height)
            .input('Shape', sql.NVarChar, order.Shape)
            .input('Shape_picture', sql.NVarChar, order.Shape_img)
            .input('Material', sql.Int, order.Material)
            .input('Color', sql.NVarChar, order.Color)
            .input('BirdType', sql.NVarChar, order.BirdType)
            .input('InflateLevel', sql.Int, order.Inflate_level)
            .input('InflatePosition', sql.Int, order.Inflate_pos)
            .input('Outline_pattern_id', sql.Int, order.Outline_pattern)
            .input('Outline_pattern_img', sql.NVarChar, order.Outline_pattern_img)
            .input('Outline_pattern_description', sql.NVarChar, order.Outline_pattern_desc)
            .input('Corner_pattern_id', sql.Int, order.Corner_pattern)
            .input('Corner_pattern_img', sql.NVarChar, order.Corner_pattern_img)
            .input('Corner_pattern_description', sql.NVarChar, order.Corner_pattern_desc)
            .input('Hook_custom', sql.Bit, order.Hook_custom)
            .input('Hook_size', sql.Int, order.Hook_size)
            .input('Hook_Color', sql.NVarChar, order.Hook_Color)
            .input('Hook_material_id', sql.Int, order.Hook_material_id)
            .input('Hook_style_id', sql.Int, order.Hook_style_id)
            .input('Hook_pattern_id', sql.Int, order.Hook_pattern)
            .input('Hook_pattern_description', sql.NVarChar, order.hook_pattern_desc)
            .input('Hook_pattern_img', sql.NVarChar, order.hook_pattern_image)
            .input('Spoke_custom', sql.Bit, order.Spoke_custom)
            .input('Spoke_amount_ver', sql.Int, order.Spoke_amount_ver)
            .input('Spoke_amount_hor', sql.Int, order.Spoke_amount_hor)
            .input('Spoke_material_id', sql.Int, order.Spoke_material)
            .input('Spoke_Color', sql.NVarChar, order.Spoke_color)
            .input('Door_custom', sql.Bit, order.Door_custom)
            .input('Door_size_x', sql.Int, order.Door_size_x)
            .input('Door_size_y', sql.Int, order.Door_size_y)
            .input('Door_material_id', sql.Int, order.Door_material)
            .input('Door_style_id', sql.Int, order.Door_style_id)
            .input('Door_pattern_id', sql.Int, order.Door_pattern)
            .input('Door_pattern_img', sql.NVarChar, order.Door_pattern_image)
            .input('Door_pattern_description', sql.NVarChar, order.Door_pattern_desc)
            .input('Door_mode', sql.Int, order.Door_mode)
            .input('Door_color', sql.NVarChar, order.Door_color)
            .input('Top_custom', sql.Bit, order.Top_custom)
            .input('Top_style_id', sql.Int, order.Top_style_id)
            .input('Top_material_id', sql.Int, order.Top_material)
            .input('Top_color', sql.NVarChar, order.Top_color)
            .input('Top_pattern_id', sql.Int, order.Top_pattern)
            .input('Top_pattern_description', sql.NVarChar, order.Top_pattern_desc)
            .input('Top_pattern_img', sql.NVarChar, order.Top_pattern_image)
            .input('Bottom_custom', sql.Bit, order.Bottom_custom)
            .input('Bottom_tilt', sql.Int, order.Bottom_tilt)
            .input('Bottom_style_id', sql.Int, order.Bottom_style_id)
            .input('Bottom_pattern_id', sql.Int, order.Bottom_pattern)
            .input('Bottom_pattern_description', sql.NVarChar, order.Bottom_pattern_desc)
            .input('Bottom_pattern_img', sql.NVarChar, order.Bottom_pattern_image)
            .input('Bottom_material_id', sql.Int, order.Bottom_material)
            .input('Bottom_color', sql.NVarChar, order.Bottom_color)
            .input('Other_description', sql.NVarChar, order.Other_description)
            .input('Detail', sql.Int, order.Detail)
            .input('Price_calculated', sql.Int, order.Price)
            .input('Price_final', sql.Int, order.Price)
            .input('Time_estimated', sql.Decimal, order.Work_time)
            .query(`
                INSERT INTO CustomCage (
                  [Name],[UserID],[Length],[Width],[Height],[Shape],[Shape_picture],[Material],[Color],[InflateLevel],[InflatePosition],
                  [Outline_pattern_id],[Outline_pattern_img],[Outline_pattern_desc],
                  [Corner_pattern_id],[Corner_pattern_img],[Corner_pattern_desc],
                  [Hook_custom],[Hook_size],[Hook_Color],[Hook_material_id],[Hook_style_id],[Hook_pattern_id],[Hook_pattern_description],[Hook_pattern_img],
                  [Spoke_custom],[Spoke_amount_ver],[Spoke_amount_hor],[Spoke_material_id],[Spoke_Color],
                  [Door_custom],[Door_size_x],[Door_size_y],[Door_material_id],[Door_style_id],[Door_pattern_id],[Door_pattern_img],[Door_pattern_description],[Door_mode],[Door_color],
                  [Top_custom],[Top_style_id],[Top_material_id],[Top_color],[Top_pattern_id],[Top_pattern_description],[Top_pattern_img],
                  [Bottom_custom],[Bottom_tilt],[Bottom_style_id],[Bottom_pattern_id],[Bottom_pattern_description],[Bottom_pattern_img],[Bottom_material_id],[Bottom_color],
                  [BirdType],[Other_description],[Detail],[Price_calculated],[Price_final],[Time_estimated],[Final_time],
                  [Order_date],[View_status],[isPublic],[UpVote],[Status_Shipping],[Status_Paid],[Updated_at]
                ) 
                OUTPUT inserted.Id
                VALUES (
                  @Name, @UserID, @Length, @Width, @Height, @Shape, @Shape_picture, @Material, @Color, @InflateLevel, @InflatePosition,
                  @Outline_pattern_id, @Outline_pattern_img, @Outline_pattern_description,
                  @Corner_pattern_id, @Corner_pattern_img, @Corner_pattern_description,
                  @Hook_custom, @Hook_size, @Hook_Color, @Hook_material_id, @Hook_style_id, @Hook_pattern_id, @Hook_pattern_description, @Hook_pattern_img,
                  @Spoke_custom, @Spoke_amount_ver, @Spoke_amount_hor, @Spoke_material_id, @Spoke_Color,
                  @Door_custom, @Door_size_x, @Door_size_y, @Door_material_id, @Door_style_id, @Door_pattern_id, @Door_pattern_img, @Door_pattern_description, @Door_mode, @Door_color,
                  @Top_custom, @Top_style_id, @Top_material_id, @Top_color, @Top_pattern_id, @Top_pattern_description, @Top_pattern_img,
                  @Bottom_custom, @Bottom_tilt, @Bottom_style_id, @Bottom_pattern_id, @Bottom_pattern_description, @Bottom_pattern_img, @Bottom_material_id, @Bottom_color,
                  @BirdType, @Other_description, @Detail, @Price_calculated, @Price_final, @Time_estimated, @Time_estimated,
                  CURRENT_TIMESTAMP, 0, 0, 0, N'Chờ duyệt', N'Chưa thanh toán',CURRENT_TIMESTAMP
                )
              `);
    return result.recordset[0].Id;
    } catch (error) {
        console.log("error: ", error);
    }
};
const updateCustomOrder = async (order) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('ID', sql.Int, order.OrderId)
            .input('Name', sql.NVarChar, order.Name)
            .input('UserID', sql.Int, order.id)
            .input('Length', sql.Int, order.Length)
            .input('Width', sql.Int, order.Width)
            .input('Height', sql.Int, order.Height)
            .input('Shape', sql.NVarChar, order.Shape)
            .input('Shape_picture', sql.NVarChar, order.Shape_img)
            .input('Material', sql.Int, order.Material)
            .input('Color', sql.NVarChar, order.Color)
            .input('BirdType', sql.NVarChar, order.BirdType)
            .input('InflateLevel', sql.Int, order.Inflate_level)
            .input('InflatePosition', sql.Int, order.Inflate_pos)
            .input('Outline_pattern_id', sql.Int, order.Outline_pattern)
            .input('Outline_pattern_img', sql.NVarChar, order.Outline_pattern_img)
            .input('Outline_pattern_description', sql.NVarChar, order.Outline_pattern_desc)
            .input('Corner_pattern_id', sql.Int, order.Corner_pattern)
            .input('Corner_pattern_img', sql.NVarChar, order.Corner_pattern_img)
            .input('Corner_pattern_description', sql.NVarChar, order.Corner_pattern_desc)
            .input('Hook_custom', sql.Bit, order.Hook_custom)
            .input('Hook_size', sql.Int, order.Hook_size)
            .input('Hook_Color', sql.NVarChar, order.Hook_Color)
            .input('Hook_material_id', sql.Int, order.Hook_material_id)
            .input('Hook_style_id', sql.Int, order.Hook_style_id)
            .input('Hook_pattern_id', sql.Int, order.Hook_pattern)
            .input('Hook_pattern_description', sql.NVarChar, order.hook_pattern_desc)
            .input('Hook_pattern_img', sql.NVarChar, order.hook_pattern_image)
            .input('Spoke_custom', sql.Bit, order.Spoke_custom)
            .input('Spoke_amount_ver', sql.Int, order.Spoke_amount_ver)
            .input('Spoke_amount_hor', sql.Int, order.Spoke_amount_hor)
            .input('Spoke_material_id', sql.Int, order.Spoke_material)
            .input('Spoke_Color', sql.NVarChar, order.Spoke_color)
            .input('Door_custom', sql.Bit, order.Door_custom)
            .input('Door_size_x', sql.Int, order.Door_size_x)
            .input('Door_size_y', sql.Int, order.Door_size_y)
            .input('Door_material_id', sql.Int, order.Door_material)
            .input('Door_style_id', sql.Int, order.Door_style_id)
            .input('Door_pattern_id', sql.Int, order.Door_pattern)
            .input('Door_pattern_img', sql.NVarChar, order.Door_pattern_image)
            .input('Door_pattern_description', sql.NVarChar, order.Door_pattern_desc)
            .input('Door_mode', sql.Int, order.Door_mode)
            .input('Door_color', sql.NVarChar, order.Door_color)
            .input('Top_custom', sql.Bit, order.Top_custom)
            .input('Top_style_id', sql.Int, order.Top_style_id)
            .input('Top_material_id', sql.Int, order.Top_material)
            .input('Top_color', sql.NVarChar, order.Top_color)
            .input('Top_pattern_id', sql.Int, order.Top_pattern)
            .input('Top_pattern_description', sql.NVarChar, order.Top_pattern_desc)
            .input('Top_pattern_img', sql.NVarChar, order.Top_pattern_image)
            .input('Bottom_custom', sql.Bit, order.Bottom_custom)
            .input('Bottom_tilt', sql.Int, order.Bottom_tilt)
            .input('Bottom_style_id', sql.Int, order.Bottom_style_id)
            .input('Bottom_pattern_id', sql.Int, order.Bottom_pattern)
            .input('Bottom_pattern_description', sql.NVarChar, order.Bottom_pattern_desc)
            .input('Bottom_pattern_img', sql.NVarChar, order.Bottom_pattern_image)
            .input('Bottom_material_id', sql.Int, order.Bottom_material)
            .input('Bottom_color', sql.NVarChar, order.Bottom_color)
            .input('Other_description', sql.NVarChar, order.Other_description)
            .input('Detail', sql.Int, order.Detail)
            .input('Price_calculated', sql.Int, order.Price)
            .input('Price_final', sql.Int, order.Price)
            .input('Time_estimated', sql.Decimal, order.Work_time)
            .query(`
               UPDATE CustomCage
                SET
                   [Name] = @Name,
                   [Length] = @Length,
                   [Width] = @Width,
                   [Height] = @Height,
                   [Shape] = @Shape,
                   [Shape_picture] = @Shape_picture,
                   [Material] = @Material,
                   [Color] = @Color,
                   [InflateLevel] = @InflateLevel,
                   [InflatePosition] = @InflatePosition,
                   [Outline_pattern_id] = @Outline_pattern_id,
                   [Outline_pattern_img] = @Outline_pattern_img,
                   [Outline_pattern_desc] = @Outline_pattern_description,
                   [Corner_pattern_id] = @Corner_pattern_id,
                   [Corner_pattern_img] = @Corner_pattern_img,
                   [Corner_pattern_desc] = @Corner_pattern_description,
                   [Hook_custom] = @Hook_custom,
                   [Hook_size] = @Hook_size,
                   [Hook_Color] = @Hook_Color,
                   [Hook_material_id] = @Hook_material_id,
                   [Hook_style_id] = @Hook_style_id,
                   [Hook_pattern_id] = @Hook_pattern_id,
                   [Hook_pattern_description] = @Hook_pattern_description,
                   [Hook_pattern_img] = @Hook_pattern_img,
                   [Spoke_custom] = @Spoke_custom,
                   [Spoke_amount_ver] = @Spoke_amount_ver,
                   [Spoke_amount_hor] = @Spoke_amount_hor,
                   [Spoke_material_id] = @Spoke_material_id,
                   [Spoke_Color] = @Spoke_Color,
                   [Door_custom] = @Door_custom,
                   [Door_size_x] = @Door_size_x,
                   [Door_size_y] = @Door_size_y,
                   [Door_material_id] = @Door_material_id,
                   [Door_style_id] = @Door_style_id,
                   [Door_pattern_id] = @Door_pattern_id,
                   [Door_pattern_img] = @Door_pattern_img,
                   [Door_pattern_description] = @Door_pattern_description,
                   [Door_mode] = @Door_mode,
                   [Door_color] = @Door_color,
                   [Top_custom] = @Top_custom,
                   [Top_style_id] = @Top_style_id,
                   [Top_material_id] = @Top_material_id,
                   [Top_color] = @Top_color,
                   [Top_pattern_id] = @Top_pattern_id,
                   [Top_pattern_description] = @Top_pattern_description,
                   [Top_pattern_img] = @Top_pattern_img,
                   [Bottom_custom] = @Bottom_custom,
                   [Bottom_tilt] = @Bottom_tilt,
                   [Bottom_style_id] = @Bottom_style_id,
                   [Bottom_pattern_id] = @Bottom_pattern_id,
                   [Bottom_pattern_description] = @Bottom_pattern_description,
                   [Bottom_pattern_img] = @Bottom_pattern_img,
                   [Bottom_material_id] = @Bottom_material_id,
                   [Bottom_color] = @Bottom_color,
                   [BirdType] = @BirdType,
                   [Other_description] = @Other_description,
                   [Detail] = @Detail,
                   [Price_calculated] = @Price_calculated,
                   [Price_final] = @Price_calculated,
                   [Time_estimated] = @Time_estimated,
                   [Final_time] = @Time_estimated,
                   [Updated_at] = CURRENT_TIMESTAMP
                WHERE
                   [ID] = @ID;
              `);
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};

const getOrdersByUserId = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Id', sql.Int, id)
            .query(`
            SELECT TOP (1000) cc.[ID]
                  ,cc.[Name]
                  ,[Price_calculated]
                  ,[Price_final]
                  ,[AddressID]
                  ,[VoucherID]
                  ,cc.PhoneNumber
                  ,[Time_estimated]
                  ,[Final_time]
                  ,[Final_img]
                  ,[StaffID]
                  ,u.Name AS Staff_Name
                  ,u.PhoneNumber AS Staff_Phone
                  ,[Shop_respond]
                    ,[Response_date]
                  ,[Updated_at]
                  ,[UpVote]
                  ,[Payment_date]
                  ,[Payment_method]
                  ,[Order_date]
                  ,[Status_shipping]
                    ,[Status_Paid]
             FROM CustomCage cc
                    LEFT JOIN [User] u ON u.Id = cc.StaffID
             WHERE USerID = @Id
        `);

        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const getGeneralById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Id', sql.Int, id)
            .query(`
          SELECT TOP (1000) cc.[ID]
                  ,cc.[Name]
                  ,u.Id AS User_id
                  ,u.Name AS User_name
                  ,[Length]
                  ,[Width]
                  ,[Height]
                  ,[Shape]
                  ,c.Name AS Shape_name
                  ,[Shape_picture]
                  ,r.Name AS Material
                  ,[Color]
                  ,op.Name AS Outline_Pattern
                  ,[Outline_pattern_img]
                  ,[Outline_pattern_desc]
                  ,cp.Name AS Corner_Pattern
                  ,[Corner_pattern_img]
                  ,[Corner_pattern_desc]
                  ,[InflateLevel]
                  ,[InflatePosition]
             FROM CustomCage cc, Material r, CustomMenu op, CustomMenu cp, [User] u, Category c
             WHERE cc.Outline_pattern_id = op.Id
                AND cc.Corner_pattern_id = cp.Id
	            AND cc.Material = r.ID
                AND cc.UserID = u.Id
                AND cc.Shape = c.Id
	            AND cc.ID = @Id
        `);
        return result.recordset[0];

    } catch (error) {
        console.log("error: ", error);
    }
}
const getHookById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Id', sql.Int, id)
            .query(`
           SELECT TOP (1000)
                cc.[ID],
                cc.[Hook_custom],
                cc.[Hook_size],
                m.Name AS Hook_Material,
                cc.[Hook_Color],
                cm.Name AS Hook_Style,
                cp.Name AS Hook_Pattern,
                cc.[Hook_pattern_description],
                cc.[Hook_pattern_img]
            FROM
                CustomCage cc
                INNER JOIN Material m ON cc.Hook_material_id = m.ID
                INNER JOIN CustomMenu cm ON cc.Hook_style_id = cm.Id
                INNER JOIN CustomMenu cp ON cc.Hook_pattern_id = cp.Id
            WHERE cc.ID = @Id
        `);
        return result.recordset[0];

    } catch (error) {
        console.log("error: ", error);
    }
}
const getSpokeById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Id', sql.Int, id)
            .query(`
            SELECT TOP (1000)
                cc.[ID]
	              ,[Spoke_custom]
                  ,[Spoke_amount_ver]
                  ,[Spoke_amount_hor]
                  ,m.Name AS Spoke_material
                  ,[Spoke_Color]
            FROM
                CustomCage cc
                INNER JOIN Material m ON cc.Spoke_material_id = m.ID
            WHERE cc.ID = @Id
        `);
        return result.recordset[0];

    } catch (error) {
        console.log("error: ", error);
    }
}
const getDoorById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Id', sql.Int, id)
            .query(`
            SELECT TOP (1000)
                cc.[ID],
                   [Door_custom]
                  ,[Door_size_x]
                  ,[Door_size_y]
                  ,m.Name AS Door_Material
                  ,cs.Name AS Door_Style
                  ,cp.Name AS Door_Pattern
                  ,[Door_pattern_img]
                  ,[Door_pattern_description]
                  ,cm.Name AS Door_Mode
                  ,[Door_color]
            FROM
                CustomCage cc
                INNER JOIN Material m ON cc.Door_material_id = m.ID
                INNER JOIN CustomMenu cs ON cc.Door_style_id = cs.Id
                INNER JOIN CustomMenu cp ON cc.Door_pattern_id = cp.Id
	            INNER JOIN CustomMenu cm ON cc.Door_mode = cm.Id
            WHERE cc.ID = @Id
        `);
        return result.recordset[0];

    } catch (error) {
        console.log("error: ", error);
    }
}
const getTopById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Id', sql.Int, id)
            .query(`
            SELECT TOP (1000)
                cc.[ID],
                   [Top_custom]
                  ,cm.Name AS Top_Style
                  ,m.Name AS Top_Material
                  ,[Top_color]
                  ,cp.Name AS Top_Pattern
                  ,[Top_pattern_description]
                  ,[Top_pattern_img]
            FROM
                CustomCage cc
                INNER JOIN Material m ON cc.Top_material_id = m.ID
                INNER JOIN CustomMenu cm ON cc.Top_style_id = cm.Id
                INNER JOIN CustomMenu cp ON cc.Top_pattern_id = cp.Id
            WHERE cc.ID = @Id
        `);
        return result.recordset[0];

    } catch (error) {
        console.log("error: ", error);
    }
}
const getBottomById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Id', sql.Int, id)
            .query(`
            SELECT TOP (1000)
                cc.[ID],
                   [Bottom_custom]
                  ,[Bottom_tilt]
                  ,m.Name AS Bottom_Material
                  ,cm.Name AS Bottom_Style
                  ,[Bottom_pattern_description]
                  ,[Bottom_pattern_img]
                  ,cp.Name AS Bottom_Pattern
                  ,[Bottom_color]
            FROM
                CustomCage cc
                INNER JOIN Material m ON cc.Bottom_material_id = m.ID
                INNER JOIN CustomMenu cm ON cc.Bottom_style_id = cm.Id
                INNER JOIN CustomMenu cp ON cc.Bottom_pattern_id = cp.Id      
            WHERE cc.ID = @Id
        `);
        return result.recordset[0];

    } catch (error) {
        console.log("error: ", error);
    }
}
const getOtherInfoById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Id', sql.Int, id)
            .query(`
            SELECT cc.[ID]
	              ,[BirdType]
                  ,[Other_description]
                  ,[Detail]
                  ,[Final_img]
                  ,[Shop_respond]
                  ,[StaffID]
                  ,u.Name AS Staff_name
                  ,[Response_date]
                  ,[Price_calculated]
                  ,[Price_final]
                  ,[VoucherID]
                  ,v.discount AS Voucher_value
                  ,[AddressID]
                  ,CONCAT(a.SoNha,', ', a.PhuongXa,', ', a.QuanHuyen,', ', a.TinhTP ) AS Address
                  ,cc.[PhoneNumber]
                  ,[Time_estimated]
                  ,Final_time
                  ,[Order_date]
                  ,[Payment_date]
                  ,Payment_method
                  ,[Status_shipping]
                  ,[Status_paid]
                  ,[View_status]
                  ,[Updated_at]
                  ,[isPublic]
                  ,[UpVote]
            FROM CustomCage cc
                LEFT JOIN [User] u ON u.Id = cc.StaffID
                LEFT JOIN UserAddress a ON a.Id = cc.AddressID
                LEFT JOIN Voucher v ON v.Id = cc.VoucherID
            WHERE cc.ID = @Id 
        `);
        return result.recordset[0];

    } catch (error) {
        console.log("error: ", error);
    }
}
const cancelOrder = async (orderId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('orderId', sql.Int, orderId)
            .query(`
            UPDATE CustomCage
                SET Status_shipping = N'Đã hủy',
                Updated_at = CURRENT_TIMESTAMP
                WHERE ID = @orderId
        `);
    } catch (error) {
        console.log("error: ", error);
    }
}
const deleteOrder = async (orderId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('orderId', sql.Int, orderId)
            .query(`
                DELETE FROM CustomCage
                WHERE ID = @orderId
        `);
    } catch (error) {
        console.log("error: ", error);
    }
}

const getCustomOrders = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .query(`
            SELECT cc.[ID]
                  ,u.Name AS User_name
                  ,cc.UserID
                  ,cc.[Name]
                  ,[Price_calculated]
                  ,[Price_final]
                  ,[AddressID]
                  ,CONCAT(a.SoNha,', ', a.PhuongXa,', ', a.QuanHuyen,', ', a.TinhTP ) AS Address
                  ,cc.PhoneNumber
                  ,[VoucherID]
                  ,[Time_estimated]
                  ,[Final_time]
                  ,[Final_img]
                  ,s.Id AS Staff_Name
                  ,[StaffID]
                  ,[Shop_respond]
                  ,[Response_date]
                  ,[Updated_at]
                  ,[UpVote]
                  ,[Payment_date]
                  ,[Payment_method]
                  ,[Order_date]
                  ,[Status_shipping]
                  ,[Status_Paid]
                  ,cc.[Point]
             FROM CustomCage cc
	             LEFT JOIN [User] u ON cc.UserID = u.Id
	             LEFT JOIN [User] s ON cc.StaffID = s.Id
                LEFT JOIN UserAddress a ON a.Id = cc.AddressID
        `);
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const getCustomOrderByStaffId = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('StaffID', sql.Int, id)
            .query(`
            SELECT cc.[ID]
	              ,u.Name AS User_name
                  ,cc.[Name]
                  ,[Price_calculated]
                  ,[Price_final]
                  ,[AddressID]
                  ,[VoucherID]
                  ,[Time_estimated]
                  ,[Final_time]
                  ,[Final_img]
                  ,[Shop_respond]
	              ,[Response_date]
                  ,[Updated_at]
                  ,[UpVote]
                  ,[Payment_date]
                  ,[Payment_method]
                  ,[Order_date]
                  ,[Status_shipping]
                  ,[Status_Paid]
             FROM CustomCage cc, [User] u
             WHERE cc.UserID = u.Id
                AND StaffID = @StaffID
        `);
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const sendMessage = async(orderId, message, id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Message', sql.NVarChar, message)
            .input('OrderID', sql.Int, orderId)
            .input('StaffID', sql.Int, id)
            .query(`
            UPDATE CustomCage
                SET Shop_respond = @Message, StaffID = @StaffID, Updated_at = CURRENT_TIMESTAMP, Response_date = CURRENT_TIMESTAMP
                WHERE ID = @OrderID
        `);

        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const changeStatus = async (orderId, status, id, finalPrice, finalTime) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Status', sql.NVarChar, status)
            .input('OrderID', sql.Int, orderId)
            .input('StaffID', sql.Int, id)
            .input('Final_price', sql.Int, finalPrice)
            .input('Final_time', sql.Decimal, finalTime)
            .query(`
                UPDATE CustomCage
                SET Status_shipping = @Status, StaffID = @StaffID, Updated_at = CURRENT_TIMESTAMP, 
	                Price_final = @Final_price, Final_time = @Final_time
                WHERE ID = @OrderID
        `);

        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const updateImage = async (orderId,url) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('Final_img', sql.NVarChar, url)
            .input('OrderID', sql.Int, orderId)
            .query(`
                UPDATE CustomCage
                SET Final_img = @Final_img, Updated_at = CURRENT_TIMESTAMP
                WHERE ID = @OrderID
        `);

        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const updatePayment = async (orderId, addressID, voucherID, phoneNumber, method, point) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('orderId', sql.Int, orderId)
            .input('addressID', sql.Int, addressID)
            .input('voucherID', sql.Int, voucherID)
            .input('phoneNumber', sql.VarChar, phoneNumber)
            .input('method', sql.NVarChar, method)
            .input('point', sql.Int, point)
            .query(`
            UPDATE CustomCage
                SET AddressID = @addressID, VoucherID = @voucherID, Payment_method = @method, PhoneNumber = @phoneNumber,
                Updated_at = CURRENT_TIMESTAMP, Point = @point
                WHERE ID = @OrderID
        `);
        if (method == "COD") {
            await poolConnection
                .request()
                .input('orderId', sql.Int, orderId)
                .query(`
            UPDATE CustomCage
                SET Status_shipping = N'Đang thi công'
                WHERE ID = @OrderID
            `)
        }
        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const updateVnpay = async (orderId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('orderId', sql.Int, orderId)
            .query(`
            UPDATE CustomCage
                SET Payment_Date = CURRENT_TIMESTAMP, Status_Paid = N'Đã thanh toán',
                Updated_at = CURRENT_TIMESTAMP
                WHERE ID = @orderId
        `);

        await poolConnection
            .request()
            .input('orderId', sql.Int, orderId)
            .query(`
            UPDATE CustomCage
                SET Status_shipping = N'Đang thi công'
                WHERE ID = @orderId
            `)

        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}

const filterCustomMenu = async (name,cate,page) => {
    try {
        const perPage = 10;
        const poolConnection = await sql.connect(config);

        const conditions = [];
        if (cate && cate != "All") conditions.push(`Category LIKE '%${cate}%'`);
        if (name) conditions.push(`Name LIKE N'%${name}%'`)
        conditions.push('isShowed = 1')

        const conditionString = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT *
            FROM [CustomMenu] 
            ${conditionString}
            ORDER BY Category ASC
            OFFSET ${(page - 1) * perPage} ROWS
            FETCH NEXT ${perPage} ROWS ONLY;
        `;

        const result = await poolConnection.request().query(query);
        const json = { data: result.recordset };

        const linesQuery = `
            SELECT COUNT(*) AS Count
            FROM [CustomMenu] 
            ${conditionString}
        `;

        const linesResult = await poolConnection.request().query(linesQuery);
        json.lines = linesResult.recordset[0];
        return json;
    } catch (error) {
        console.log("error: ", error);
    }
}
const addCustomMenu = async (name,category,url) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('name', sql.NVarChar, name)
            .input('category', sql.NVarChar, category)
            .input('url', sql.NVarChar, url)
            .query(`
            INSERT INTO CustomMenu (Name, Category, Picture, isShowed)
            VALUES (@name, @category, @url, 1)
        `);
        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const updateCustomMenu = async (id, name, category, url) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('category', sql.NVarChar, category)
            .input('url', sql.NVarChar, url)
            .query(`
            UPDATE CustomMenu
            SET Name = @name, Category = @category, Picture = @url
            WHERE Id = @id
        `);
        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}
const deleteCustomMenu = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('id', sql.Int, id)
            .query(`
            UPDATE CustomMenu
            SET isShowed = 0
            WHERE Id = @id
        `);
        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}

const updateCustomPrice = async (id, price) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
            .request()
            .input('id', sql.Int, id)
            .input('Price', sql.Int, price)
            .query(`
            UPDATE CustomPricing
            SET Price = @Price
            WHERE Id = @id
        `);
        return result.recordset;

    } catch (error) {
        console.log("error: ", error);
    }
}


module.exports = {
    getItems,
    getAllItems,
    getPricing,
    addCustomOrder,
    updateCustomOrder,
    getOrdersByUserId,
    getGeneralById,
    getHookById,
    getSpokeById,
    getDoorById,
    getTopById,
    getBottomById,
    getOtherInfoById,
    cancelOrder,
    deleteOrder,
    getCustomOrders,
    getCustomOrderByStaffId,
    sendMessage,
    changeStatus,
    updateImage,
    updatePayment,
    updateVnpay,
    addCustomMenu,
    updateCustomMenu,
    deleteCustomMenu,
    filterCustomMenu,
    updateCustomPrice
}