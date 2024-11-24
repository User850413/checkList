import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: { type: String, default: 'DEFAULT', required: true },
});

const Tag = mongoose.models['Tag'] || mongoose.model('Tag', tagSchema);

export default Tag;
