
import connect from "@/database/connect";
import { getAllRooms } from "@/controller/room.controller";

export default async function handler(req, res) {
  connect().catch((err)=>res.status(400).json({error: "connect error"}))
  
  switch(req.method){
case 'GET':
    res.json("GET Request")
    break;
    case 'POST':
    res.json("POST Request")
    break;

    default:
        res.setHeader('Allow', ['GET', 'POST'] );
        res.status(400).json({ error :`Method ${method} not allow`})
        break;
  }

}
