const Product = require("../models/Product");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const {
  cache,
} = require("./redisCache");

const router = require("express").Router();

const Redis = require('ioredis');
const redis = new Redis();

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

//GET PRODUCT BY CATEGORY - Original function
// router.get("/findCat/:category", cache, async (req, res) => {
//   try {
//     const products = await Product.find({category: req.params.category});
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//GET PRODUCT BY CATEGORY - Redis cache function
router.get("/findCat/:category", cache, async (req, res) => {
  try {
    const cacheKey = req.originalUrl;
    const products = await Product.find({category: req.params.category});
    // console.log('Data not found in cache!');
    await redis.set(cacheKey, JSON.stringify(products), 'EX', 3600);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS - Original function
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//GET ALL PRODUCTS - Redis cache function
router.get("/", cache, async (req, res, next) => {
  try {
    const cacheKey = req.originalUrl;
    const products = await Product.find();
    await redis.set(cacheKey, JSON.stringify(products), 'EX', 3600);
    // console.log('Data not found in cache!');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
