import  Message  from "../models/message.model";
import  Room  from "../models/room.model";
import {Configuration, OpenAIApi} from 'openai'
import ENV from '../config.env'

export async function getChat(req, res) {
    try {

        const { roomid } = req.query; 
        if (!roomid) return res.status(400).json({ error: "no room id" })
        const messages = await Message.find({ room: roomid },{__v:0, room: 0})
        if (!messages) return res.status(400).json({ error: "no messages found" })
       
        return res.status(200).json({sucess :true, data : messages})
    } catch (error) {
        return res.status(400).json({ error });
    }
}

export async function createChat(req, res) {
    try {

        const { roomid } = req.query; 
        const { question, answer } = req.body; 
        if (!roomid) return res.status(400).json({ error: "no room id" })
        if (!question&& !answer) return res.status(400).json({ error: "Cannot get data" })
        const rooms = await Room.findOne({ _id: roomid })
        if (!rooms) return res.status(400).json({ error: "no room found" })
        const config = new Configuration({
            apikey: ENV.OPENAI_API_KEY

    })
        const openai = new OpenAIApi(config);

        const completion = await openai.createCompletion({
            model : "text-davinci-003",
            prompt: question,
            temperature: 0.2,
            max_tokens: 100,
            top_p : 1
            
        })

       const message = new Message({
            question : question,
            answer :completion.data.choices[0].text,
            room : roomid
    })
    //save
    await message.save();
    //push
    rooms.messages.push(message._id);
    //save in room
    await rooms.save()
        return res.status(200).json({sucess :true, data : message})
    } catch (error) {
        return res.status(400).json({ error });
    }
}