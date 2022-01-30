const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");

app.use(express.json());

// Route imports     *****     Jan,30 - 15:46 //
const product = require("./routes/ProductRoute");

app.use("/api/v1",product);


// * MiddleWare for Error     *****     Jan,31 - 04:08 //
app.use(errorMiddleware);

module.exports = app;