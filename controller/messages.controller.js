import OpenAI from 'openai';
import Message from "../models/message.model";
import Room from "../models/room.model";
import ENV from '../config.env';

export async function getChat(req, res) {
    try {
        const { roomid } = req.query;
        if (!roomid) return res.status(400).json({ error: "no room id" });

        const room = await Room.findById(roomid).populate('messages');
        if (!room) return res.status(404).json({ error: "Room not found" });

        return res.status(200).json({ success: true, data: room.messages });
    } catch (error) {
        console.error("Error in getChat:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function createChat(req, res) {
    try {
        const { roomid } = req.query;
        const { question } = req.body;

        if (!roomid) return res.status(400).json({ error: "no room id" });
        if (!question) return res.status(400).json({ error: "No question provided" });

        const room = await Room.findOne({ _id: roomid });
        if (!room) return res.status(400).json({ error: "no room found" });


        const openai = new OpenAI({
            apiKey: ENV.OPENAI_API_KEY,
        });

        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-1106",
                messages: [
                    /*{
                        "role": "system",
                        "content": "You are a knowledgeable assistant in computer science. If the user asks a question not related to computer science, kindly reply with 'Please ask some of the questions that belong to computer science.'"
                    },*/
                    { "role": "user", "content": question }
                ],
                temperature: 0.7,
                max_tokens: 150,
            });
        } catch (error) {
            console.error("Error in API call:", error);
            return res.status(500).json({ error: "Failed to get a response from the OpenAI API" });
        }

        console.log(completion);

        if (!completion || !completion.choices || completion.choices.length === 0) {
            return res.status(500).json({ error: "Invalid response structure from OpenAI API" });
        }

        const messageChoice = completion.choices[0];
        if (!messageChoice.message || !messageChoice.message.content) {
            return res.status(500).json({ error: "Invalid message structure in the response" });
        }

        const messageText = messageChoice.message.content;

        const message = new Message({
            question: question,
            answer: messageText,
            room: roomid
        });

        await message.save();
        room.messages.push(message._id);
        await room.save();

        return res.status(200).json({ success: true, data: message });
    } catch (error) {
        console.error("Error in createChat:", error);
        return res.status(500).json({ error: error.message });
    }
}
