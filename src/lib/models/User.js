import mongoose from 'mongoose';

// Схема для користувачів (приклад)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Імʼя є обовʼязковим'],
    maxlength: [60, 'Імʼя не може бути довше 60 символів']
  },
  email: {
    type: String,
    required: [true, 'Email є обовʼязковим'],
    unique: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Перевіряємо чи модель вже існує (для уникнення помилок у режимі розробки)
export default mongoose.models.User || mongoose.model('User', UserSchema);