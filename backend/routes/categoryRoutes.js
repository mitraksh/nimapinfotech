const express = require('express');

const categoryControllers = require('../controllers/categoryControllers');
const productRouter = require('./productRoutes');

const router = express.Router();

router
  .route('/')
  .get(categoryControllers.getAllCategories)
  .post(categoryControllers.createCategory);

router.use('/:categoryId/products', productRouter);

router
  .route('/:categoryId')
  .patch(categoryControllers.updateCategory)
  .delete(categoryControllers.deleteCategory);

module.exports = router;
