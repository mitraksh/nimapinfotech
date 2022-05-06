const express = require('express');

const productControllers = require('../controllers/productControllers');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(productControllers.getAllProducts)
  .post(productControllers.createProduct);

router
  .route('/:productId')
  .patch(productControllers.updateProduct)
  .delete(productControllers.deleteProduct);

module.exports = router;
