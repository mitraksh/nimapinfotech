const mongoose = require('mongoose');

// SCHEMA
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      minlength: [3, 'Product name must have more or equal than 3 characters'],
      unique: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// MIDDLEWARE
productSchema.pre(/^find/, function (next) {
  this.populate('category');
  next();
});

// MODEL
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
