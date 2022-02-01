const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // * Wrong MongoDb Id Error, i.e CAST ERROR     *****     Jan,31 - 04:59 //
    if (err.name === "CastError") {
        const msg = `Resource Not Found | Invalid: ${err.path}`;
        err = new ErrorHandler(msg,400);
    };

    // * Mongoose Duplicate Key Error     *****     Feb,01 - 13:17 //
    if(err.code === 11000){
        const msg = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(msg,400);
    };

    // * Wrong JWT Error     *****     Jan,31 - 04:59 //
    if (err.name === "JsonWebTokenError") {
        const msg = `Json Web Token is Invalid, Try Again`;
        err = new ErrorHandler(msg,400);
    };

    // * JWT Expire Error     *****     Jan,31 - 04:59 //
    if (err.name === "TokenExpiredError") {
        const msg = `Json Web Token is Expired, Try Again`;
        err = new ErrorHandler(msg,400);
    };

    res.status(err.statusCode).json({
        success:false,
        error:err.stack,
        message:err.message
    });
};