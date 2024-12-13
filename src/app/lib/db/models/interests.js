import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  name: { type: String, default: '기타', required: true, unique: true },
});

const Interest =
  mongoose.models['Interest'] || mongoose.model('Interest', interestSchema);

// delete mongoose.models['Interest'];
// delete mongoose.modelSchemas['Interest'];

export default Interest;
