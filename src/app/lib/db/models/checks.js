import mongoose from 'mongoose';

const checkSchema = new mongoose.Schema(
  {
    task: { type: String, default: '', required: true },
    isCompleted: { type: Boolean, default: false },
    tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true },
  },
  { timestamps: true }
);

// type: mongoose.Schema.Types.ObjectId,
// ref: 'Tag',

// delete mongoose.models['Check'];
// delete mongoose.modelSchemas['Check'];

const Check = mongoose.models['Check'] || mongoose.model('Check', checkSchema);

export default Check;
