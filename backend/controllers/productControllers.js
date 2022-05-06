const Product = require('../models/productModel');
const catchAsyncError = require('../utilities/catchAsyncError');
const AppError = require('../utilities/appError');

exports.createProduct = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const category = req.params.categoryId;
  if (!name || !category) {
    return next(
      new AppError('Please provide the product name and category', 400)
    );
  }
  await Product.create({ name, category });
  const allProducts = await Product.find({ category: req.params.categoryId });
  const totalProducts = allProducts.length;
  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: {
      totalProducts,
    },
  });
});

exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const productsPerPage = +req.query.productsPerPage;
  const page = +req.query.page;
  let findQuery = Product.find({ category: req.params.categoryId });
  if (productsPerPage && page) {
    findQuery = findQuery
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage);
  }
  const products = await findQuery;
  if (products.length === 0) {
    return next(new AppError('There are no products found', 404));
  }
  const allProducts = await Product.find({ category: req.params.categoryId });
  const totalProducts = allProducts.length;
  const transformedProducts = products.map((product) => {
    return {
      id: product._id,
      name: product.name,
      category: product.category.name,
      categoryId: product.category._id,
    };
  });
  res.status(200).json({
    status: 'success',
    message: 'Products fetched successfully',
    data: {
      products: transformedProducts,
      totalProducts,
    },
  });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  await Product.findByIdAndUpdate(req.params.productId, req.body, {
    runValidators: true,
    new: true,
  });
  const allProducts = await Product.find({ category: req.params.categoryId });
  const totalProducts = allProducts.length;
  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: {
      totalProducts,
    },
  });
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.productId);
  const allProducts = await Product.find({ category: req.params.categoryId });
  const totalProducts = allProducts.length;
  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
    data: {
      totalProducts,
    },
  });
});
