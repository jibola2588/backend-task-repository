const Product = require('../models/productModel')

const products_get = async (req, res) => {
    try {
      // Find all products in the database
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

 const single_product_get = async (req, res) => {
    try {
      // Find the product with the specified ID in the database
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  const product_post =  async (req, res) => {
    try {
      // Create a new product object from the request body
      const { name, price, quantity } = req.body;
      const product = new Product({ name, price, quantity });
      // Save the new product to the database
      await product.save();
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  const single_product_edit =  async (req, res) => {
    try {
      // Find the product with the specified ID in the database
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      // Update the product object with the new data from the request body
      const { name, price, quantity } = req.body;
      product.name = name;
      product.price = price;
      product.quantity = quantity;
      // Save the updated product to the database
      await product.save();
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  const product_delete = async (req, res) => {
    try {
      // Find the product with the specified ID in the database and delete it
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  module.exports = { 
    products_get,
    single_product_get,
    product_post,
    single_product_edit,
    product_delete
  }