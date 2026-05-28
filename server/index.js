const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/courses", require("./routes/courseRoutes"));

app.use("/api/recommend", require("./routes/recommendRoutes"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("API Running");
});

app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});