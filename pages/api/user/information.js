import jwt from 'jsonwebtoken';
import User from '../../../models/user';
import connect from '../../../database/connect';

export default async function handler(req, res) {
  try {
    await connect();
    
    if (req.method === 'GET') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { name, role, _id,identify } = user;
      res.status(200).json({ name, role, _id, identify });
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
