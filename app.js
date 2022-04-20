const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");

const corsMW = require("./middlewares/corsMW");
const errorMW = require("./middlewares/errorMW");

const readingRoutes = require("./routes/readingRoutes");
const gatewayRoutes = require("./routes/gatewayRoutes");
const nodeRoutes = require("./routes/nodeRoutes");
const patientRoutes = require("./routes/patientRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use(corsMW);

app.use("/readings", readingRoutes);
app.use("/gateways", gatewayRoutes);
app.use("/nodes", nodeRoutes);
app.use("/patients", patientRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/test", testRoutes);

app.use(errorMW);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0zw4e.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true`
  )
  .then((result) => {
    console.log("Connected to MongoDB");
    const server = app.listen(process.env.PORT || 8000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected ", socket.id);
      socket.on("disconnect", (reason) => console.log(reason));
    });
  })
  .catch((err) => console.log(err));
