const express = require("express");
const Product = require("../models/productModel");

// * ONLY ADMIN can Create Product      *****     Jan,30 - 19:52 //
exports.createProduct = async(req,res,next)=>{
    const product = await Product.create(req.body);
    res.status(200).json({
        success:true,
        product
    })
};



// * Get all Products     *****     Jan,30 - 20:06 //
exports.getAllProducts = async(req,res)=>{
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products
    })
}


// * Get Single Product     *****     Jan,30 - 22:28 //
exports.getProductDetails = async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
    }

    res.status(200).json({
        success:true,
        product
    })
}


// * only admin can Update Product     *****     Jan,30 - 20:11 //
exports.updateProduct = async(req,res,next)=>{
    let product = Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
}

// * Only Admin can delete Product     *****     Jan,30 - 22:16 //

exports.deleteProduct = async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
    }

    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product Deleted successfully"
    })
}