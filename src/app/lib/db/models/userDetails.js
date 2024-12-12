import mongoose from 'mongoose';

const userDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bio: {
    type: String,
  },
  interest: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Interest',
  },
});

const UserDetail =
  mongoose.models['UserDetail'] ||
  mongoose.model('UserDetail', userDetailSchema);

export default UserDetail;
