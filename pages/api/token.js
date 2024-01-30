import jwt from 'jsonwebtoken';
import User from '../../models/user';
import dbConnect from '../../database/connect';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No authorization token was found' });
        }

        const token = authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                console.log('Token validation failed: User not found');
                return res.status(401).json({ message: 'Token is invalid or user does not exist' });
            }
            console.log('Token is valid, returning isValid: true');
            res.status(200).json({ isValid: true });
        } catch (error) {
            console.log('Token validation error:', error.message);
            res.status(401).json({ isValid: false, message: 'Token is invalid' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
