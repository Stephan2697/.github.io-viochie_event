const mongoose = require('mongoose');

// Contact submission schema
const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name must not exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [200, 'Subject must not exceed 200 characters'],
    default: 'No Subject'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [5000, 'Message must not exceed 5000 characters']
  },
  file: {
    filename: String,
    path: String,
    mimeType: String,
    size: Number
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded'],
    default: 'new'
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'contact_submissions'
});

// Create indexes for better query performance
contactSubmissionSchema.index({ email: 1, createdAt: -1 });
contactSubmissionSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to update timestamp
contactSubmissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the model
module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
