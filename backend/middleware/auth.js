const ErrorHandler = require("../utils/errorhandler");
const catchAsynError = require("./catchAsynError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsynError(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to Access this Resource",401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decodedData.id);

    console.log(req.user);
    
    next();

});

exports.authorizeRoles = (...roles)=>{
    
    return (req,res,next)=>{
        // * If User : then run If Block else Run next();     *****     Jan,31 - 17:04 //
        if(!roles.includes(req.user.role)){
            
            return next(new ErrorHandler(`Role: ${req.user.role} is not Allowed to access this Resource`,403));
        };
        next();
    };
};