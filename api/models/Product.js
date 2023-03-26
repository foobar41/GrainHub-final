const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    key: { type: Number, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    img: { type: String, required: true },
    quantity: { type: Number, default: true },
  }
);

// define a pre-save hook
productSchema.pre('save', function(next) {
  const doc = this;
  // check if the key field is not set, then generate a new key value
  if (!doc.key) {
    Product.findOne({}, {}, { sort: { 'key': -1 } }, function(err, product) {
      if (err) return next(err);
      // set the new key value to 1 greater than the current highest key value
      doc.key = product && product.key ? product.key + 1 : 1;
      next();
    });
  } else {
    next();
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
