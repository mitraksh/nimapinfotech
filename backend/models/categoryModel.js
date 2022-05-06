const mongoose = require('mongoose');

// SCHEMA
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category must have a name'],
    minlength: [3, 'Category name must have more or equal than 3 characters'],
    unique: true,
  },
});

// VIRTUAL POPULATE
// categorySchema.virtual('products', {
//   ref: 'Product',
//   foreignField: 'category',
//   localField: '_id',
// });

// MODEL
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
