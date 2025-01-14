import mongoose from 'mongoose';

const userTagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [
    {
      tagId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const UserTag =
  mongoose.models['UserTag'] || mongoose.model('UserTag', userTagSchema);

// delete mongoose.models['UserTag'];
// delete mongoose.modelSchemas['UserTag'];

export default UserTag;
