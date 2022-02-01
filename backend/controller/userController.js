const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsynError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")

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

// * Forgot Password     *****     Feb,01 - 10:24 //
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{

    const user =await User.findOne({email:req.body.email});

    if (!user) {
        return next(new ErrorHandler("User Not Found",404));
    };

    // * Get Reset Password Token     *****     Feb,01 - 10:27 //
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    // * Creating Link to rest password     *****     Feb,01 - 10:32 //
    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password Reset token is : \n\n${resetPasswordURL} \n\nIf you have not requested this Email then Please Ignore it`;

    try {
        await sendEmail({
            email:user.email,
            subject:`Ecommerce_Anuj Password Recovery`,
            message
        });

        res.status(200).json({
            success:true,
            message:`Email Sent to ${user.email} Successfully`,
        });
    
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message,500));
    }
    
});