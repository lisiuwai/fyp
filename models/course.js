import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    contactInfo: String,
    studentNumber: String,
    assignment : String,
    project: String,
    exam: String,
    deadline: String,
    msassignment : String,
    deadline: String,
    msproject: String,
  }, { collection: 'course' });

export default mongoose.models.Course  ||mongoose.model('Course', CourseSchema, 'course')

