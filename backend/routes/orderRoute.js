const express = require("express");
const router = express.Router();
const { newOrder, getSingleOrder, myOrders, deleteOrder } = require("../controller/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// * Only ADMIN     *****     Feb,02 - 17:52 //
router.route("/order/:id").get(isAuthenticatedUser, authorizeRoles("admin"),getSingleOrder);
// .delete(isAuthenticatedUser, authorizeRoles("admin"),deleteOrder);

// * For all users and admins     *****     Feb,02 - 17:54 //
router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrders);
// router.route("/order/me/delete/:id").delete(isAuthenticatedUser,deleteOrder)

module.exports = router;