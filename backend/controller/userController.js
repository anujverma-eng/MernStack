const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsynError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

// * Register a User     *****     Jan,31 - 09:56 //
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "This is the sample ID",
            url: "profilePicURL"
        },
    });
    console.log(user)

    sendToken(user, 201, res);
});


// * Login User     *****     Jan,31 - 11:30 //
exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    // * Checking if user has given the password and email both     *****     Jan,31 - 12:07 //
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email OR Password", 401));
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email OR Password", 401));
    }

    // console.log(user);
    
    sendToken(user, 200, res);

});

// * Log OUT     *****     Jan,31 - 16:43 //
exports.logout=catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });
    
    res.status(200).json({
        success:true,
        message:"Logged Out Successfully",
    });
});