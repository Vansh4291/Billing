const express = require("express");
const router = express.Router();
const BillingItem = require("../model/BillingItem");
const Order = require("../model/Order");

// ======== BILLING ITEMS ========

// GET all items
router.get("/items", async (req, res) => {
  try {
    const items = await BillingItem.find();
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADD new item
router.post("/items/add", async (req, res) => {
  try {
    const item = new BillingItem(req.body);
    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ADD new order
router.post("/orders/add", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
