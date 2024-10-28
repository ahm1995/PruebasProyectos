import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    require: true,
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
        return (
          age > 18 ||
          (age === 18 && monthDiff > 0) ||
          (age === 18 && monthDiff === 0 && today.getDate() >= v.getDate())
        );
      },
      message: "Debes tener al menos 18 años.",
    },
    immutable: true,
  },
  phoneNumber: {
    type: Number, // Usar String para mayor flexibilidad
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{8,15}$/.test(v); // Validar longitud y formato
      },
      message: "El número de teléfono debe tener entre 8 y 15 dígitos",
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
        return /^\S+@\S+\.\S+$/.test(v); // Validación de formato de email
      },
      message: "El formato del email no es válido",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    //match:
    //  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    // Explicación de la expresión regular:
    // - `(?=.*[a-z])`: al menos una minúscula
    // - `(?=.*[A-Z])`: al menos una mayúscula
    // - `(?=.*\d)`: al menos un número
    // - `(?=.*[@$!%*?&])`: al menos un símbolo especial
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
  dateOfJoining: {
    type: Date,
  },
  dateOfTermination: {
    type: Date,
  },
  salary: [
    {
      amount: {
        type: Number,
        default: 0,
      },
      changeDescription: {
        type: String,
      },
      changeReason: {
        type: String,
      },
      date: {
        type: Date,
      },
      effectiveDate: {
        type: Date,
      },
      reviewedBy: {
        type: String, // Puede ser un ID de usuario de la base de datos
      },
      approvalDate: {
        type: Date,
      },
    },
  ],
  employeeNumber: {
    type: String,
    immutable: true,
    unique: true,
  },
  jobRecord: [
    {
      jobId: {
        type: String,
      },
      jobPosition: {
        type: String,
      },
      department: {
        type: String,
      },
      dateOfJoining: {
        type: Date,
      },
      dateOfTermination: {
        type: Date,
      },
      authorizationId: {
        type: String,
      },
      dateOfRecord: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  previousExperience: [
    {
      company: {
        type: String,
      },
      rol: {
        type: String,
      },
      duration: {
        type: Number,
      },
    },
  ],
  education: [
    {
      degree: {
        type: String,
      },
      institution: {
        type: String,
      },
      year: {
        type: Number,
      },
    },
  ],
  benefits: [
    {
      healthInsurance: {
        company: {
          type: String,
        },
        contractNumber: {
          type: String,
        },
        phoneNumber: {
          type: Number,
        },
        medicalCondition: {
          type: String,
        },
        medicalEvents: [
          {
            eventType: {
              type: String,
            },
            eventDescription: {
              type: String,
            },
            eventDeductible: {
              type: Number,
            },
            eventStartingDate: {
              type: Date,
            },
            eventFinishDate: {
              type: Date,
            },
          },
        ],
      },
      bonus: [
        {
          date: {
            type: Date,
          },
          amount: {
            type: Number,
          },
          bonusDescription: {
            type: String,
          },
          effectiveDate: {
            type: Date,
          },
          authorizationId: {
            type: String,
          },
        },
      ],
      vacations: [
        {
          startingDate: {
            type: Date,
          },
          endingDate: {
            type: Date,
          },
          approval: {
            approvalState: {
              type: Boolean,
              default: false,
            },
            approvalDate: {
              type: String,
            },
            authorizationId: {
              type: String,
            },
          },
        },
      ],
    },
  ],
  emergencyContact: [
    {
      name: {
        type: String,
      },
      phoneNumber: {
        type: Number,
      },
      relationship: {
        type: String,
      },
    },
  ],
  performanceRecords: [
    {
      date: {
        type: Date,
      },
      evaluation: {
        type: String,
      },
      evaluatorId: {
        type: String,
      },
    },
  ],
  disciplinaryHistory: [
    {
      date: {
        type: Date,
      },
      incident: {
        type: String,
      },
      reporterId: {
        type: String,
      },
    },
  ],
  preferences: {
    language: {
      type: String,
      enum: ["en", "es", "fr", "de"], // Enumerar idiomas admitidos
      default: "es",
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "MXN"], // Monedas aceptadas
      default: "MXN",
    },
    notifications: {
      type: Boolean,
      default: true, // Notificaciones activadas por defecto
    },
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  permissions: {
    canEditRecords: { type: Boolean, default: false },
    canViewRecords: { type: Boolean, default: false },
    canManageEmployees: { type: Boolean, default: false },
  },
  loginRecord: [
    {
      date: {
        type: Date,
        default: Date.now, // Se agrega automáticamente la fecha del login
      },
      ipAddress: {
        type: String, // Guarda la IP del usuario para registros
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

const Employee = mongoose.model("employee", employeeSchema);

export default Employee;
