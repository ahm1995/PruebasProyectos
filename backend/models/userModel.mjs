import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40,
    trim: true,
    lowercase: true,
  },
  birthday: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        const today = new Date();
        const age = today.getFullYear() - v.getFullYear();
        const monthDiff = today.getMonth() - v.getMonth();
        // Comprobar si el usuario tiene al menos 18 años
        return age > 18 || (age === 18 && monthDiff > 0) || (age === 18 && monthDiff === 0 && today.getDate() >= v.getDate());
      },
      message: 'Debes tener al menos 18 años.',
    },
    immutable: true,
  },
  phoneNumber: {
    type: String, // Usar String para mayor flexibilidad
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10,15}$/.test(v);  // Validar longitud y formato
      },
      message: 'El número de teléfono debe tener entre 10 y 15 dígitos',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v);  // Validación de formato de email
      },
      message: 'El formato del email no es válido',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,  // Requiere al menos 8 caracteres
  },
  addresses: [
    {
      street: {
        type: String,
        maxlength: 100,
      },
      city: {
        type: String,
        maxlength: 50,
      },
      state: {
        type: String,
        maxlength: 50,
      },
      postalCode: {
        type: String, // Usar String para códigos postales con ceros iniciales
        maxlength: 10,
      },
      country: {
        type: String,
        maxlength: 50,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
    },
  ],
  preferences: {
    language: {
      type: String,
      enum: ["en", "es", "fr", "de"],  // Enumerar idiomas admitidos
      default: "es",
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "MXN"],  // Monedas aceptadas
      default: "MXN",
    },
    notifications: {
      type: Boolean,
      default: true,  // Notificaciones activadas por defecto
    },
  },
  userRole: {
    type: String,
    enum: ["admin", "customer", "seller"],
    required: true,
  },
  orderHistory: [
    {
      orderNumber: {
        type: String,
        required: true,
      },
      orderDate: {
        type: Date,
        required: true,
      },
      items: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',  // Referencia a un modelo de producto
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      }],
      totalAmount: {
        type: Number,
        required: true,
      },
      orderStatus: {
        type: String,
        enum: ["pending", "shipped", "delivered", "canceled"],
        default: "pending",
      },
    },
  ],
  wishlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wishlist',  // Relaciona la lista de deseos si existe un modelo
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  referralCode: {
    type: String,
  },
  referredBy: {
    type: String, // Código de referencia del usuario que los refirió
  },
  socialAccounts: {
    facebookId: { type: String },
    googleId: { type: String },
    twitterId: { type: String },
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  loginRecord: [
    {
      date: {
        type: Date,
        default: Date.now,  // Se agrega automáticamente la fecha del login
      },
      ipAddress: {
        type: String,  // Guarda la IP del usuario para registros
      },
    },
  ],
  permissions: {
    canEditProducts: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    // Otros permisos específicos
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;