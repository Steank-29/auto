const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Il nome è obbligatorio'],
      trim: true,
      minlength: [2, 'Il nome deve contenere almeno 2 caratteri'],
      maxlength: [100, 'Il nome non può superare i 100 caratteri'],
    },
    email: {
      type: String,
      required: [true, 'L\'email è obbligatoria'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Inserisci un indirizzo email valido',
      ],
    },
    subject: {
      type: String,
      required: [true, 'L\'oggetto è obbligatorio'],
      trim: true,
      maxlength: [200, 'L\'oggetto non può superare i 200 caratteri'],
    },
    message: {
      type: String,
      required: [true, 'Il messaggio è obbligatorio'],
      trim: true,
      minlength: [10, 'Il messaggio deve contenere almeno 10 caratteri'],
      maxlength: [5000, 'Il messaggio non può superare i 5000 caratteri'],
    },
    status: {
      type: String,
      enum: ['pending', 'read', 'replied', 'archived'],
      default: 'pending',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1 });

module.exports = mongoose.model('Contact', contactSchema);