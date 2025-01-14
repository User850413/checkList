import mongoose from 'mongoose';

const userTagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tagId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Tag',
    required: true,
    default: [],
  },
});

const UserTag =
  mongoose.models['UserTag'] || mongoose.model('UserTag', userTagSchema);

export default UserTag;
