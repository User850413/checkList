import mongoose from 'mongoose';

const sharedTagSchema = new mongoose.Schema({
  name: {
    type: String,
    ref: 'Tag',
    required: true,
    default: null,
  },
  interest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest',
    default: null,
  },
  list: { type: [String], required: true, default: [] },
});

const SharedTag =
  mongoose.models['SharedTag'] || mongoose.model('SharedTag', sharedTagSchema);

// delete mongoose.models['SharedTag'];
// delete mongoose.modelSchemas['SharedTag'];

export default SharedTag;
