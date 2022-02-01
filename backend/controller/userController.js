const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsynError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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
exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
});

// * Forgot Password     *****     Feb,01 - 10:24 //
exports.forgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    };

    // * Get Reset Password Token     *****     Feb,01 - 10:27 //
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // * Creating Link to rest password     *****     Feb,01 - 10:32 //
    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password Reset token is : \n\n${resetPasswordURL} \n\nIf you have not requested this Email then Please Ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce_Anuj Password Recovery`,
            message
        });

        res.status(200).json({
            success: true,
            message: `Email Sent to ${user.email} Successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }

});

// * Reset Password     *****     Feb,01 - 12:56 //
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    // * Creating Token Hash     *****     Feb,01 - 12:59 //
    const resetPasswordToken = crypto.createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    // * Now Search the Token in our database     *****     Feb,01 - 12:59 //
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has been Expired", 400));
    };

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password Does not Matched", 400));
    }

    // * Now the User has updated the Password, and we also need to update it in our database     *****     Feb,01 - 13:05 //
    user.password = req.body.password;
    

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);

});

// * Get User Details     *****     Feb,01 - 13:27 //
exports.getUserDetail = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success:true,
        user,
    });
});


// * Update User Password     *****     Feb,01 - 13:27 //
exports.updatePassword = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Old Password is Incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password Does not Match", 400));
    }
    
    user.password = req.body.newPassword;

    await user.save();
    
    sendToken(user,200,res);
});

// * Update User Profile     *****     Feb,01 - 13:27 //
exports.updateProfile = catchAsyncError(async(req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    // TODO: We will add cloudinary Later, i.e Update Avatar in user Profile     *****     Feb,01 - 14:51 //

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        user
    })

    sendToken(user,200,res);
});

// * Get All Users  (ADMIN)   *****     Feb,01 - 15:32 //
exports.getAllUsers = catchAsyncError(async(req,res,next)=>{

    const users = await User.find();
    
    res.status(200).json({
        success:true,
        users
    })
    
});

// * Get All Users  (ADMIN)   *****     Feb,01 - 15:32 //
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User Does Not Exists",404));
    }
    
    res.status(200).json({
        success:true,
        user
    })
    
});


// * Update User ROLE  -- ADMIN   *****     Feb,01 - 13:27 //
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        user
    })

    sendToken(user,200,res);
});

// * Delete User  -- ADMIN   *****     Feb,01 - 13:27 //
exports.deleteUser = catchAsyncError(async(req,res,next)=>{

    // TODO: We will REMOVE  cloudinary Later, i.e Update Avatar in user Profile     *****     Feb,01 - 14:51 //

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User Does not Exist",404))
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })

    sendToken(user,200,res);
});