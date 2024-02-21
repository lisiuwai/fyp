import Message from '../../../models/message.model'; 

export default async function handler(req, res) {

    try {
      const mostFrequentQuestions = await Message.aggregate([
        {
          $group: {
            _id: "$question",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
  
      if (mostFrequentQuestions.length > 0) {
        return res.status(200).json({ success: true, data: mostFrequentQuestions });
      } else {
        return res.status(404).json({ success: false, error: "No questions found." });
      }
    } catch (error) {
      return res.status(400).json({ success: false, error: error.toString() });
    }
  }