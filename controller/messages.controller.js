import OpenAI from 'openai';
import Message from "../models/message.model";
import Room from "../models/room.model";
import ENV from '../config.env';
import nlp from 'compromise';
import Course from '@/models/course';

const courseInfoKeywords = {
    'studentNumber': ['group project', 'team assignment', 'project participants'],
    'contactInfo': ['contact', 'teacher info', 'instructor contact', 'find the teacher'],
    'assignment': ['requirement of assignment'], 
    'project': ['requirement of project'], 
    'deadline': ['deadline', 'submit'], 
    'msassignment': ['marking scheme of assignment'], 
    'exam': ['exam'], 
    'msproject': ['marking scheme of project'], 
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

function findMatchedField(question) {
    let matchedField = null;
    const normalizedQuestion = question.toLowerCase();
  
    Object.entries(courseInfoKeywords).forEach(([field, keywords]) => {
      keywords.forEach(keyword => {
        if (normalizedQuestion.includes(keyword)) {
          matchedField = field;
        }
      });
    });
  
    return matchedField;
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
        const matchedField = findMatchedField(question);

        function extractKeywords(text) {
            const punctuationRegex = /[.,\/#!$%\^&?\*;:{}=\-_`~()]/g;
            text = text.replace(punctuationRegex, '').toLowerCase();
            const stopwords = ['i', 'you', 'me', 'some', 'of', 'can', 'give', 'is', 'what', 'the', 'a', 'an', 'to', 'ask'];
            const words = text.split(/\s+/).filter(word => !stopwords.includes(word));

            let doc = nlp(words.join(' '));
            let keywords = doc.nouns().out('array');

            if (keywords.length === 0) {
                return words.slice(0, 5).join(' ');
            }
            return keywords.join(' ');
        }

        if (matchedField) {
            const courseField = matchedField;
            const course = await Course.findOne();
            if (!course || !course[courseField]) {
                console.log("Course information not found for field: ", matchedField);
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
            baseURL: "https://api.xty.app/v1",
        });

        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-0125",
                messages: [
                        {
                           "role": "system",
                           "content": "You are a knowledgeable assistant in computer science. Your role is to guide users to use the system ethically and support their learning. If a question is outside the computer science domain, you will redirect the user to relevant computer science topics with a polite message. Encourage users to think critically and learn from the interaction rather than providing direct solutions to assignments or tests.'"
                       }, 
                    { "role": "user", "content": question }
                ],
                temperature: 0.5,
                max_tokens: 500,
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
