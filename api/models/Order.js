const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object },
    status: { type: String, default: "pending" },
  },
  { timestamps: {
    currentTime: () => new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  } }
);

module.exports = mongoose.model("Order", OrderSchema);

// npx browserslist@latest --update-db