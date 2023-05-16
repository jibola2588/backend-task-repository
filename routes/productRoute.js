const express = require('express');
const productRouter = express.Router();
const passport = require('passport');
const productController = require('../controllers/productController')

productRouter.get('/products', passport.authenticate('jwt', { session: false }),productController.products_get );

productRouter.get('/products/:id', passport.authenticate('jwt', { session: false }), productController.single_product_get);

productRouter.post('/products', passport.authenticate('jwt', { session: false }),productController.product_post);

productRouter.put('/products/:id', passport.authenticate('jwt', { session: false }),productController.single_product_edit);

productRouter.delete('/products/:id', passport.authenticate('jwt', { session: false }),productController.product_delete );

module.exports = productRouter;