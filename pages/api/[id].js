import User from '../../models/user';
import bcrypt from 'bcrypt';
import connect from '../../database/connect';

export default async function handler(req, res) {
  await connect();
  const { id } = req.query;

  if (req.method === 'GET') {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } else if (req.method === 'PUT') {
    const { email, name, password, identify } = req.body;
    const updateData = { email, name, identify };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedUser);
  } else if (req.method === 'DELETE') {
    // Delete user
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
