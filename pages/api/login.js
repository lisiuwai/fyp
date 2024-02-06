import jwt from 'jsonwebtoken';
import User from '../../models/user';

export default async function loginHandler(req, res) {
  try {

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication failed: User not found.' });
    }

    if (user.password !== password) {
      console.log("Authentication failed: Incorrect password");
      return res.status(403).json({ success: false, message: 'Authentication failed: Incorrect password.' });
    }

    if (user.password === password) {
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email,
          identify: user.identify 
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
        identify: user.identify
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
