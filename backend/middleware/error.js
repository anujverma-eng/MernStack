const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // ! Wrong MongoDb Id Error, i.e CAST ERROR     *****     Jan,31 - 04:59 //
    if (err.name === "CastError") {
        const msg = `Resource Not Found | Invalid: ${err.path}`;
        err = new ErrorHandler(msg,400);
    }

    res.status(err.statusCode).json({
        success:false,
        error:err.stack,
        message:err.message
    });
};