const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const billingRoutes = require("./routes/billingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// DB connect
mongoose
  .connect("mongodb://127.0.0.1:27017/mern_billing_db")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err.message));

// Routes
app.get("/", (req, res) => res.send("Billing API running"));
app.use("/item", billingRoutes);

app.listen(3000, ()=>{
    console.log("Server is running on the port number 3000");
})
