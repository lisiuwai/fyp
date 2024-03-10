import OpenAI from 'openai';
import Message from "../models/message.model";
import Room from "../models/room.model";
import ENV from '../config.env';
import nlp from 'compromise';
import Course from '@/models/course';

const courseInfoKeywords  = {
  'group project': 'studentNumber',
  'contact' : 'contactInfo',
  'requirement of assignment': 'assignment',
  'requirement of project': 'project',
  'deadline' : 'deadline',
  'marking scheme of assignment' : 'msassignment',
  'exam' : 'exam',
  'marking scheme of project' : 'msproject',
}; 

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

        const keywords = extractKeywords(question);

        function extractKeywords(text) {
            const punctuationRegex = /[.,\/#!$%\^&?\*;:{}=\-_`~()]/g;
            text = text.replace(punctuationRegex, '').toLowerCase(); 
            const stopwords = ['i', 'you', 'me', 'some', 'of', 'can', 'give', 'is', 'what', 'the', 'a', 'an','to','ask'];
            const words = text.split(/\s+/).filter(word => !stopwords.includes(word)); 

            let doc = nlp(words.join(' ')); 
            let keywords = doc.nouns().out('array');
          
            if (keywords.length === 0) {
                return words.slice(0, 5).join(' '); 
            }
            return keywords.join(' '); 
          }

        const keywordMatch = Object.keys(courseInfoKeywords).find(keyword => 
            question.toLowerCase().includes(keyword)
        );

        if (keywordMatch) {
            const courseField = courseInfoKeywords[keywordMatch];
            const course = await Course.findOne(); 
            if (!course || !course[courseField]) {
                console.log("Course information not found for keyword: ", keywordMatch);
                return res.status(404).json({ error: "Course information not found" });
            }

            const messageText = course[courseField];
            console.log(`Responding with course information: ${messageText}`);

            const message = new Message({
                question,
                answer: messageText,
                room: room._id,
                keywords: keywords
            });

            await message.save();
            room.messages.push(message._id);
            await room.save();
            return res.status(200).json({ success: true, data: message });
        }
        
        const openai = new OpenAI({
            apiKey: ENV.OPENAI_API_KEY,
        });
    
        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-0125",
                messages: [
                    /*    {
                           "role": "system",
                           "content": "You are a knowledgeable assistant in computer science. If a question is outside this domain, it will redirect the user to computer science topics with a polite message.'"
                       }, */
                    { "role": "user", "content": question }
                ],
                temperature: 0.7,
                max_tokens: 100,
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
            room: roomid,
            keywords: keywords
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
