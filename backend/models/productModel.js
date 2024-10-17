const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlenght: 50,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    require: true,
    minlength: 2,
    maxlenght: 500,
    trim: true,
    lowercase: true,
  },
  price: {
    type: Number,
    require: true,
  },
  categoryId: {
    type: String,
  },
  images: [
    {
      link: {
        type: String,
      },
    },
  ],
  stock: {
    type: Number,
    require: true,
  },
  sales: {
    type: Number,
  },
  averageRating: {
    type: Number,
  },
  specifications: [
    {
      color: {
        type: String,
      },
      size: [
        {
          width: {
            type: Number,
          },
          length: {
            type: Number,
          },
          height: {
            type: Number,
          },
        },
      ],
      weight: {
        type: Number,
      },
      material: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
