const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 20,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 40,
    trim: true,
    lowercase: true,
  },
  birthday: {
    type: Date,
    required: true,
    min: 0,
    inmutable: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  adresses: [
    {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: Number,
      },
      country: {
        type: String,
      },
      isDefault: {
        type: Boolean,
      },
    },
  ],
  preferences: {
    languaje: {
      type: String,
    },
    currency: {
      type: String,
    },
    notifications: {
      type: Boolean,
    },
  },
  userRole: {
    type: String,
    enum: ["admin", "customer", "vendor"],
    required: true,
  },
  orderHistory: [
    {
      orderNumber: {
        type: String,
      },
      orderDate: {
        type: Date,
      },
    },
  ],
  wishlistId: {
    type: String,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  changesHistory: [
    {
      changeDescription: {
        type: String,
      },
      changeDate: {
        type: Date,
      },
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
