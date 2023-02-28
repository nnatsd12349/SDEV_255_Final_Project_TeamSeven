const mongoose = require('mongoose');
const Schema= mongoose.Schema;


const courseSchema = new Schema({
    name: { type: String, required: true},
    desc: { type: String, required: true},
    dept: { type: String, required: true},
    levl: { type: Number, required: true},
    cred: { type: Number, required: true},
    preq: { type: Number, required: true}
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;