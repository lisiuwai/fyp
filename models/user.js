import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userid: String,
    password: String,
    identify : String,
    name: String,
  }, { collection: 'user' });

export default mongoose.models.User || mongoose.model('User', userSchema);

