import connect from "@/database/connect";
import { getRoom, deleteRoom, updateRoom } from "@/controller/room.controller";

export default async function handler(req, res) {
  await connect().catch((err) => res.status(400).json({ error: "connect error" }));
  
  switch (req.method) {
    case 'GET':
      await getRoom(req, res);
      break;
    case 'DELETE':
      await deleteRoom(req, res);
      break;
    case 'PUT':
      await updateRoom(req, res); 
      break;
    default:
      res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
