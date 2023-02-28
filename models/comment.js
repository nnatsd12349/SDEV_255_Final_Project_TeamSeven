const mongoose = require('mongoose');
const Schema= mongoose.Schema;


const commentSchema = new Schema({
    titl: { type: String, required: true},
    snip: { type: String, required: true},
    body: { type: String, required: true}
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;