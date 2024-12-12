import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: { type: String, default: 'DEFAULT', required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  interest: {
    type: mongoose.Schema.Types.String,
    ref: 'Interest',
    default: '기타',
  },
});

const Tag = mongoose.models['Tag'] || mongoose.model('Tag', tagSchema);

// delete mongoose.models['Tag'];
// delete mongoose.modelSchemas['Tag'];

export default Tag;
