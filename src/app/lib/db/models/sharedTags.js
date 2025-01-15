import mongoose from 'mongoose';

const sharedTagSchema = new mongoose.Schema({
  sharedTag: { type: mongoose.Schema.Types.ObjectId },
  ref: 'Tag',
  require: true,
  default: null,
});

const SharedTag =
  mongoose.models['SharedTag'] || mongoose.model('SharedTag', sharedTagSchema);

export default SharedTag;
