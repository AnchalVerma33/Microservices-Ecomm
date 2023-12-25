const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isValidated: {
    type: Boolean,
    default: false,
  },
  gender: String,
  salt: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Mongoose middleware to update the updatedAt field before each update operation
userSchema.pre('updateOne', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
