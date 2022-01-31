// * Creating Token and Saving in Cookie     *****     Jan,31 - 16:15 //

const sendToken = (user, statusCode, res) => {

    const token = user.getJWTTOken();

    // * options for Cookie     *****     Jan,31 - 16:09 //
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token
    });
};

module.exports = sendToken;