const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [3, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password"],
        minLength: [8, "Password should more than 8 characters"],
        select: false, // ! Select should be False because: when the data is called we should not share the password information with anyone     *****     Jan,31 - 09:46 //

    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
});

// * JWT TOKEN     *****     Jan,31 - 10:36 //
userSchema.methods.getJWTTOken = function () {

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
};

// * Compare Password     *****     Jan,31 - 12:13 //
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);

}

// * RESET Password     *****     Jan,31 - 20:14 //
userSchema.methods.getResetPasswordToken = function(){

    // * Generating Token     *****     Feb,01 - 10:17 //
    const resetToken = crypto.randomBytes(20).toString("hex");

    // * Hashing and add to userSchema     *****     Feb,01 - 10:19 //
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now()+15*60*1000;

    return resetToken;

}


module.exports = mongoose.model("User", userSchema);