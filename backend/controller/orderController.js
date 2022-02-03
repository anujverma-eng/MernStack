const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsynError");


// * Create New Order     *****     Feb,02 - 16:27 //
exports.newOrder = catchAsyncError(async (req,res,next) => {
    
    const {shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice}= req.body;

    const order = await Order.create({shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success:true,
        order
    });

    
});


// * Get Single Order   --ADMIN  *****     Feb,02 - 17:44 //
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("Order Not found with this id",404));

    }

    res.status(200).json({
        success: true,
        order
    });
    
});

// * Get Logged in User - order     *****     Feb,02 - 17:49 //
exports.myOrders = catchAsyncError(async (req, res, next) => {

    const orders = await Order.find({user:req.user._id});

    if(!orders){
        return next(new ErrorHandler("You have not Placed any order yet",404));

    }

    res.status(200).json({
        success: true,
        orders
    });
});

// * Get All Orders     *****     Feb,03 - 13:32 //

