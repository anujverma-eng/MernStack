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

// * Delete Order --- Created by Real me    *****     Feb,02 - 18:48 //
// exports.deleteOrder = catchAsyncError(async (req, res, next) => {

//     const order = await Order.findById(req.params.id);
//     const userId = req.body;

//     if(!order){
//         return next(new ErrorHandler("Order Not found with this id",404));
//     }

//     console.log("User Logged In: "+req.user._id.toString());
//     console.log("Order.user:     "+order.user.toString());
    
    
//     // * Only the Logged in user with his own order can delete this order.     *****     Feb,02 - 19:18 //
//     if(order.user.toString()===req.user._id.toString() || req.user.role ==="admin"){
//         console.log("Success");
        
//         await order.remove();
//     }else{
//         return next(new ErrorHandler("You can't delete this order as you are to not the right authority to access this order"))
//     }

//     res.status(200).json({
//         success: true,
//         message:"Order Removed successfully"
//     });
    

// });


