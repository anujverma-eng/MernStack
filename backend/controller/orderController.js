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

// * Get All Orders --ADMIN   ****    *****     Feb,03 - 13:32 //
exports.getAllOrders = catchAsyncError(async (req, res, next) => {

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
    
});

// * Update Order Status --ADMIN   ****    *****     Feb,03 - 13:37 //
exports.updateOrder = catchAsyncError(async (req, res, next) => {

    
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found",404));
    }
    // console.log(order.orderStatus);
    
    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler("You have Delivered this Order ",400));
    }

    order.orderItems.forEach(async(o)=>{
        await updateStock(o.product,o.quantity)
    });

    order.orderStatus = req.body.status;
    if(req.body.status === 'Delivered'){
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false});

    res.status(200).json({
        success: true,
    });

});

async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    product.save({validateBeforeSave:false});

}

// * Delete Order     *****     Feb,03 - 13:48 //
exports.deleteOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found to delete",404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    })
})