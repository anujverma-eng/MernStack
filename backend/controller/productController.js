const express = require("express");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsynError");
const ApiFeatures = require("../utils/apifeatures");

// * ONLY ADMIN can Create Product      *****     Jan,30 - 19:52 //
exports.createProduct = catchAsyncError(async (req, res, next) => {
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
        product,
        productCount
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