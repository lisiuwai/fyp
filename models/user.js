import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userid: String,
    password: String,
  }, { collection: 'user' });

export default mongoose.models.User || mongoose.model('User', userSchema);

