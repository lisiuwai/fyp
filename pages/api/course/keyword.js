import Message from '../../../models/message.model';
import nlp from 'compromise';

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
      try {
        const messages = await Message.find({}, 'keywords');
        const allKeywords = messages.map(msg => msg.keywords).join(' '); 
        const words = allKeywords.toLowerCase().split(/\s+/).filter(Boolean);
        
        const wordCounts = words.reduce((acc, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        }, {});
        
        const sortedWordCounts = Object.entries(wordCounts)
          .map(([word, count]) => ({ word, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        res.status(200).json({ success: true, data: sortedWordCounts });
      } catch (error) {
        res.status(500).json({ success: false, error: error.toString() });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }    
  }    