const Product = require("../models/Product");
const ObjectId = require('mongoose').Types.ObjectId;

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
  // console.log('started')
  // const filePath = path.join("api", "products.json");
  // const jsonData = fs.readFileSync(filePath, { encoding: "utf8" });
  // const products = JSON.parse(jsonData);

  const newProduct = new Product(req.body);
  // console.log(products);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedStock = req.body.in_stock;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          in_stock: updatedStock
        }
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE ALL DETAILS OF A PRODUCT
router.put("/updateAll/:id", verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = req.body;
    const updatedProductDetails = await Product.findByIdAndUpdate(
      productId,
      {
        $set: updatedProduct
      },
      { new: true }
    );
    res.status(200).json(updatedProductDetails);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT BY CATEGORY
router.get("/findCat/:category", async (req, res) => {
  try {
    const product = await Product.find({category: req.params.category});
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
