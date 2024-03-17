import Message from '../../../models/message.model'; 

export default async function handler(req, res) {
  try {

    const excludeKeywords = ["hi", "hello", "hey"]; 

    const mostFrequentQuestions = await Message.aggregate([
      {
        $match: {
          
          "question": { $not: { $in: excludeKeywords.map(keyword => new RegExp(`^\\s*${keyword}\\s*$`, "i")) } }
        }
      },
      {
        $addFields: {
          trimmedQuestion: { $trim: { input: "$question" } }
        }
      },
      {
        $group: {
          _id: "$trimmedQuestion",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    if (mostFrequentQuestions.length > 0) {
      const punctuationRegex = /[.,\/#!$%\^&?\*;:{}=\-_`~()]/g;
      const cleanedQuestions = mostFrequentQuestions.map(question => ({
        ...question,
        _id: question._id.replace(punctuationRegex, '')
      }));

      return res.status(200).json({ success: true, data: cleanedQuestions });
    } else {
      return res.status(404).json({ success: false, error: "No questions found." });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error.toString() });
  }
}
