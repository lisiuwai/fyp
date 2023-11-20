
import connect from "@/database/connect";
import { getRoom,deleteRoom} from "@/controller/room.controller";

export default async function handler(req, res) {
  connect().catch((err)=>res.status(400).json({error: "connect error"}))
  
  switch(req.method){
case 'GET':
   await getRoom(req, res)
    break;
    case 'DELETE':
      await deleteRoom(req, res)
    break;

    default:
        res.setHeader('Allow', ['GET', 'DELETE'] );
        res.status(400).json({ error :`Method ${method} not allow`})
        break;
  }

}
