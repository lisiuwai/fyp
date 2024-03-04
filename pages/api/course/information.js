import Course from '../../../models/course';

export default async function handler(req, res) {
  const fixedId = '65e2d9b9371bc41222a0eb14';

  if (req.method === 'GET') {
    try {
      const course = await Course.findById(fixedId);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const course = new Course(req.body);
      await course.save();
      res.status(201).json({ success: true, message: 'Course information saved successfully', data: course });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error saving course information', error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const course = await Course.findByIdAndUpdate(fixedId, req.body, {
        new: true,
        runValidators: true,
      });
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
