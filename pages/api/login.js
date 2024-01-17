import jwt from 'jsonwebtoken';
import connect from '../../database/connect';
import User from '../../models/user';

export default async function loginHandler(req, res) {
  try {
    await connect();

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { userid, password } = req.body;

    const user = await User.findOne({ userid: userid });
    console.log("Database query result:", user);
    if (!user) {
     
      return res.status(401).json({ success: false, message: 'Authentication failed: User not found.' });
      
    }
    
    //alert("User found in database");

    if (user.password !== password) {
      console.log("Authentication failed: Incorrect password");
      return res.status(403).json({ success: false, message: 'Authentication failed: Incorrect password.' });
    }

    console.log("Authentication successful");

    const token = jwt.sign(
      { id: user._id, userid: user.userid },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } 
    );

    res.status(200).json({ success: true, message: 'Login successful', token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
