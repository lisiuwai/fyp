import Message from '../../../models/message.model';
import nlp from 'compromise';

function extractKeywords(text) {
    const punctuationRegex = /[.,\/#!$%\^&?\*;:{}=\-_`~()]/g;
    let doc = nlp(text);
    const stopwords = ['you', 'me', 'some', 'of', 'can', 'give', 'is', 'what', 'the', 'a', 'an'];
    let keywords = doc.nouns().out('array');

    if (keywords.length === 0) {
        const match = text.match(/what is\s+(.*)/i);
        if (match) {
            let filteredMatch = match[1].split(' ')
                .filter(word => !stopwords.includes(word.toLowerCase()))
                .map(word => word.replace(punctuationRegex, ''))
                .join(' ');
            return [filteredMatch];
        } else {
            let fallbackKeywords = text.split(/\s+/)
                .filter(word => !stopwords.includes(word.toLowerCase()))
                .map(word => word.replace(punctuationRegex, ''))
                .slice(0, 5)
                .join(' ');
            return [fallbackKeywords];
        }
    }
    return keywords.join(' ');
}

export default async function handler(req, res) {
   
    if (req.method === 'POST') {
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
    } else if (req.method === 'GET') {
      const punctuationRegex = /[.,\/#!$%\^&?\*;:{}=\-_`~()]/g;

      try {
        const keywords = await Message.aggregate([
          { $unwind: "$keywords" },
          { $group: { _id: "$keywords", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]);
  
        const cleanedKeywords = keywords.map(keyword => ({
          _id: keyword._id.replace(punctuationRegex, ''),
          count: keyword.count
        }));
    
        if (cleanedKeywords.length > 0) {
          res.status(200).json({ success: true, data: cleanedKeywords });
        } else {
            res.status(404).json({ success: false, error: "No keywords found." });
          }
        } catch (error) {
          res.status(500).json({ success: false, error: error.toString() });
        }
      } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    
}