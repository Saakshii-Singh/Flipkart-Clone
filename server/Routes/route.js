import express from 'express';
import { getProductById, getProducts } from '../Controller/product-controller.js';
import { userSignUp, userLogIn } from '../Controller/user-controller.js';
//import { addItemInCart } from '../Controller/cart-controller.js';
//import { addPaymentGateway, paymentResponse } from '../Controller/payment-controller.js';
import { isAuthenticated } from "../Middleware/authMiddleware.js";
const router = express.Router();

//  Auth Routes
router.post('/signup', userSignUp);
router.post('/login', userLogIn);

// 🛍 Product Routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

//  Cart Routes
//router.post('/cart/add', isAuthenticated, addItemInCart);

//  Payment Routes
// router.post('/payment', isAuthenticated, addPaymentGateway);
// router.post('/callback', paymentResponse);

router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});
export default router;