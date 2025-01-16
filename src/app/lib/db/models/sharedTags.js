import mongoose from 'mongoose';

const sharedTagSchema = new mongoose.Schema({
  name: {
    type: String,
    ref: 'Tag',
    require: true,
    default: null,
  },
  list: { type: [String], require: true, default: [] },
});

const SharedTag =
  mongoose.models['SharedTag'] || mongoose.model('SharedTag', sharedTagSchema);

// delete mongoose.models['SharedTag'];
// delete mongoose.modelSchemas['SharedTag'];

export default SharedTag;
