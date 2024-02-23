import User from '../../../models/user';
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

      await user.save();
      res.status(201).json({ success: true, user: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }

  } else if (req.method === 'PUT') {
    const { id, email, name, password, identify } = req.body;
  
    try {
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      user.email = email || user.email;
      user.name = name || user.name;
      user.identify = identify || user.identify;
  
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await user.save();
  
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }else if (req.method === 'DELETE') {
    const { id } = req.body;
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
   else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
