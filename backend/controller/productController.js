const express = require("express");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsynError");
const ApiFeatures = require("../utils/apifeatures");

// * ONLY ADMIN can Create Product      *****     Jan,30 - 19:52 //
exports.createProduct = catchAsyncError(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    })
});



// * Get all Products     *****     Jan,30 - 20:06 //
exports.getAllProducts = catchAsyncError(async (req, res) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();


    const apifeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apifeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount
    })
});


// * Get Single Product     *****     Jan,30 - 22:28 //
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })
});


// * only admin can Update Product     *****     Jan,30 - 20:11 //
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 500))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
});

// * Only Admin can delete Product     *****     Jan,30 - 22:16 //

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 500))
    }

    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product Deleted successfully"
    })
});

// * Create New Review OR Update the Review     *****     Feb,01 - 16:10 //
exports.createProductReview = catchAsyncError(async (req, res, next) => {

    console.log(req.user.id);
    
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    console.log(productId);
    
    const product = await Product.findById(productId);

    console.log(product);
    
    
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
        );

    if (isReviewed) {
        product.reviews.forEach((rev) => {

            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });

    } else {
        product.reviews.push(review);
        
        product.numOfReviews = Number(product.reviews.length);
        
    }

    let avg = 0;
    product.reviews.forEach((rev)=>{
        avg+=Number(rev.rating);
    });
    
    // * Fixed Decimals with .toFixed(1)     *****     Feb,01 - 17:50 //
    let totalRating =avg/product.reviews.length; 
    product.ratings =totalRating.toFixed(1);
    
    

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true
    })

});


// * Get ALl Reviews of Single Product     *****     Feb,01 - 17:55 //
exports.getProductReviews = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    };

    res.status(200).json({
        success:true,
        reviews: product.reviews,
    });

    
    
});

// * Delete Review of Single Product     *****     Feb,01 - 17:55 //
exports.deleteReviews = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    };


    const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString());
    
    let avg = 0;
    reviews.forEach((rev)=>{
        avg+=Number(rev.rating);
    });
    
    // * Fixed Decimals with .toFixed(1)     *****     Feb,01 - 17:50 //
    let totalRating =avg/reviews.length; 
    const ratings =totalRating.toFixed(1);

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{reviews,ratings,numOfReviews},{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });

    
});