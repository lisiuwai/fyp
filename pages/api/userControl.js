import connect from '../../database/connect';
import User from '../../models/user';

export default async function handler(req, res) {
  await connect();

  if (req.method === 'GET') {
    try {
      const users = await User.find({}); 
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    // Handle user creation
  } else if (req.method === 'PUT') {
    // Handle user update
  } else if (req.method === 'DELETE') {
    // Handle user deletion
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
