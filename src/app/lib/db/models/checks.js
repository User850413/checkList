import mongoose from 'mongoose';

const checkSchema = new mongoose.Schema(
  {
    task: { type: String, default: '', require: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Check = mongoose.models['Check'] || mongoose.model('Check', checkSchema);

export default Check;
