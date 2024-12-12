import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  name: { type: String, default: '기타', required: true },
});

const Interest =
  mongoose.models['Interest'] || mongoose.model('Interest', interestSchema);

export default Interest;
