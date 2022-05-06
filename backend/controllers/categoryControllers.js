const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const catchAsyncError = require('../utilities/catchAsyncError');
const AppError = require('../utilities/appError');

exports.createCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(new AppError('Please provide the category name', 400));
  }
  const category = await Category.create({ name });
  const transformedCategory = { id: category._id, name: category.name };
  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    data: {
      category: transformedCategory,
    },
  });
});

exports.getAllCategories = catchAsyncError(async (req, res, next) => {
  const categories = await Category.find();
  const transformedCategories = categories.map((category) => {
    return {
      id: category._id,
      name: category.name,
    };
  });
  res.status(200).json({
    status: 'success',
    message: 'Categories fetched successfully',
    data: {
      categories: transformedCategories,
      // totalCategories,
    },
  });
});

exports.updateCategory = catchAsyncError(async (req, res, next) => {
  await Category.findByIdAndUpdate(req.params.categoryId, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
    data: null,
  });
});

exports.deleteCategory = catchAsyncError(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.categoryId);
  await Product.deleteMany({ category: req.params.categoryId });
  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully',
    data: null,
  });
});
