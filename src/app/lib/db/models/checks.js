import mongoose from 'mongoose';

const checkSchema = new mongoose.Schema(
  {
    task: { type: String, default: '' },
  },
  { timestamps: true }
);

const Check = mongoose.models['Check'] || mongoose.model('Check', checkSchema);

export default Check;
