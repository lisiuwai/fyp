import Room from '../models/room.model'

// GET http://localhost:3000/api/room
export async function getAllRooms(req, res) {
    try {
        const rooms = await Room.find({})
        return res.status(200).json({ success: true, data: rooms })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

// POST http://localhost:3000/api/room
export async function createRoom(req, res) {
    try {
 
        const len = await (await Room.find({})).length;
        const defaultRoom = {
            name: `Room ${len + 1}`,
            messages: []
        }

        const chat = await Room.create(defaultRoom);
        return res.status(200).json({ success: true, data: chat })
    } catch (error) {
        return res.status(400).json({ error })
    }
}