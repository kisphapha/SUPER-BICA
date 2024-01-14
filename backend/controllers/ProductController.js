const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getProductById = async (req, res) => {
    try {
        const products = await Product.getProductById(req.params.id);
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getProductByName = async (req, res) => {
    try {
        const products = await Product.getProductByName(req.params.name);
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getImgsOfProduct = async (req, res) => {
    try {
        const response = await Product.getImgsOfProduct(req.params.code);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.getProductsByCategory(req.params.code);
        res.json(products);
    }catch (error){
        res.status(500).json({message: error.message})
    }
}


const getNewProductToDB = async (req, res) => {
    try {
        const Name = req.body.Name;
        const Description = req.body.Description;
        const Price = req.body.Price;
        const Stock = req.body.Stock;
        const Category = req.body.Category;
        const material = req.body.material;
        const Size = req.body.Size;
        const SuitableBird = req.body.SuitableBird;
        const discount = req.body.discount;
        const Status = req.body.Status;
        const Urls = req.body.Urls

        await Product.addNewProductToDB(Name, Description, Price, Category, material, SuitableBird, discount, Size, Stock, Status, Urls);
        res.json({ message: "done" });
    }catch (error){
        res.status(500).json({message: error.message});
    }
}
const updateProduct = async (req, res) => {
    try {
        const Id = req.body.Id;
        const Name = req.body.Name;
        const Description = req.body.Description;
        const Price = req.body.Price;
        const Stock = req.body.Stock;
        const Category = req.body.Category;
        const material = req.body.material;
        const Size = req.body.Size;
        const SuitableBird = req.body.SuitableBird;
        const discount = req.body.discount;
        const Status = req.body.Status;
        const Url = req.body.Url;
        await Product.updateProduct(Id,Name, Description, Price, Stock, Category, material, Size, SuitableBird, discount, Status, Url);
        res.json({ message: "done" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteProduct = async (req, res) => {
    try {
        const Id = req.params.id;

        await Product.deleteProduct(Id);
        res.json({ message: "done" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRatingByProductId = async (req, res) => {
    try {
        const ratings = await Product.getRatingByProductId(req.params.id)
        res.json(ratings);
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

const deleteFeedback = async (req, res) => {
    try {
        const response = await Product.deleteFeedback(req.params.fbId);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addRating = async (req, res) => {
    try {

        const UserId = req.body.id;
        const ProductId = req.body.ProductId;
        const StarPoint = req.body.StarPoint;
        const Content = req.body.Content;

        const response = await Product.addRating(UserId, ProductId, StarPoint, Content);
        res.json({ Id: response});
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

const addReply = async (req, res) => {
    try {

        const UserId = req.body.id;
        const FeedbackId = req.body.FeedbackId;
        const Content = req.body.Content;

        await Product.addReply(UserId, FeedbackId, Content);
        res.json({ message: "done" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const paging = async (req, res) => {
    try {
        const products = await Product.paging(req.body.page, req.body.cate);
        res.json(products);
    }catch (e) {
        res.status(500).json({message: e.message})
    }
}

const filterProduct = async (req, res) => {
    try {
        //id,name,category,upper_price,lower_price,upper_stock,lower_stock,status
        const id = req.body.id;
        const name = req.body.name;
        const category = req.body.category;
        const upper_price = req.body.upper_price;
        const lower_price = req.body.lower_price;
        const upper_stock = req.body.upper_stock;
        const lower_stock = req.body.lower_stock;
        const page = req.body.page;
        const status = req.body.status;

        const products = await Product.filterProduct(id, name, category,upper_price,lower_price,upper_stock,lower_stock, status, page);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const pagingSearchBar = async(req, res) => {
    try {
        const name = req.body.name;
        const page = req.body.page;

        const products = await Product.pagingSearchBar(name, page);
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
const restoreQuantity = async (req, res) => {
    try {
        const products = await Product.restoreQuantity(req.body.Id, req.body.Quantity);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductByName,
    getProductsByCategory,
    getNewProductToDB,
    addRating,
    addReply,
    getRatingByProductId,
    updateProduct,
    deleteProduct,
    deleteFeedback,
    paging,
    filterProduct,
    pagingSearchBar,
    getImgsOfProduct,
    restoreQuantity
};
