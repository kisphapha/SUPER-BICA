const express = require("express");
const ProductController = require("../controllers/ProductController")
const authentication = require('../authentication')

const productRouter = express.Router();
productRouter.get("/", ProductController.getAllProducts);
productRouter.get("/cate/:code", ProductController.getProductsByCategory);
productRouter.get("/img/:code", ProductController.getImgsOfProduct)

productRouter.get("/search/:name", ProductController.getProductByName)
productRouter.post("/add", authentication.adminAuthenToken, ProductController.getNewProductToDB);
productRouter.post("/update", authentication.adminAuthenToken, ProductController.updateProduct);
productRouter.get("/rating/:id", ProductController.getRatingByProductId);
productRouter.post("/rating", authentication.verifyUserToken, ProductController.addRating);
productRouter.post("/reply", authentication.verifyUserToken, authentication.staffAuthenToken, ProductController.addReply);
productRouter.post("/paging/category", ProductController.paging);
productRouter.post("/filter/", ProductController.filterProduct);
productRouter.post("/paging/search", ProductController.pagingSearchBar);

productRouter.get("/:id", ProductController.getProductById);
productRouter.patch("/stock", authentication.verifyServerKey, ProductController.restoreQuantity);
productRouter.delete("/rating/:id/:fbId", authentication.verifyUserToken, ProductController.deleteFeedback);
productRouter.delete("/:id", authentication.adminAuthenToken, ProductController.deleteProduct);






module.exports = productRouter;