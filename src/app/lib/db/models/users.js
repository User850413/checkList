import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileUrl: { type: String, default: null },
    refreshToken: { type: String },
  },
  { timestamps: true },
);

// 비밀번호 해싱 (회원가입 전)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// delete mongoose.models['User'];
// delete mongoose.modelSchemas['User'];

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
