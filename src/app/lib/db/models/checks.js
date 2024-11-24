import mongoose from 'mongoose';

const checkSchema = new mongoose.Schema(
  {
    task: { type: String, default: '', required: true },
    isCompleted: { type: Boolean, default: false },
    tag: { type: String, default: 'DEFAULT', required: true },
  },
  { timestamps: true }
);

const Check = mongoose.models['Check'] || mongoose.model('Check', checkSchema);

export default Check;
