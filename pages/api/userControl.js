import User from '../../models/user';
import bcrypt from 'bcrypt';
export default async function handler(req, res) {

  if (req.method === 'GET') {
    try {
      const users = await User.find({}); 
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    const { email, name, password, identify } = req.body;

    try {

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashedPassword,
        identify 
      });

      // Save user
      await user.save();
      res.status(201).json({ success: true, user: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    // Handle user update
  } else if (req.method === 'DELETE') {
    // Handle user deletion
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
