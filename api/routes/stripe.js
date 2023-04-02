const router = require("express").Router();
const KEY = process.env.STRIPE_KEY
const stripe = require("stripe")(KEY);

router.post("/payment", async (req, res) => {

  await stripe.paymentIntents.create({
    amount: req.body.amount * 100,
    currency: "inr",
    automatic_payment_methods: { enabled: true },
  })
});

module.exports = router;
