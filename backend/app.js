const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

// Route imports     *****     Jan,30 - 15:46 //
const product = require("./routes/ProductRoute");
const user = require("./routes/userRoute");

app.use("/api/v1",product);
app.use("/api/v1",user);


// * MiddleWare for Error     *****     Jan,31 - 04:08 //
app.use(errorMiddleware);

module.exports = app;