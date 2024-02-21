import Message   from '../../../models/message.model'; 
import nlp from 'compromise';

function extractKeywords(text) {
  let doc = nlp(text);
  let keywords = doc.nouns().out('array'); 

  if (keywords.length === 0) {
      // Fallback strategy for extracting keywords, e.g., regex or simplified analysis
      const match = text.match(/what is\s+(.*)/i);
      if (match) {
          return [match[1]];
      } else {
          return [text.split(/\s+/).slice(0, 5).join(' ')];
      }
  }
  return keywords;
}

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
      try {
          const questionText = req.body.question;
          const keywords = extractKeywords(questionText);

          const question = await Message.create({
              ...req.body,
              keywords: keywords
          });

          res.status(201).json({ success: true, data: question });
      } catch (error) {
          res.status(400).json({ success: false, error: error.toString() });
      }
  } else {
      // Handle other methods or return an error
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}