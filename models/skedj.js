const mongoose = require('mongoose');
const Schema= mongoose.Schema;


const skedjSchema = new Schema({
    ownr: { type: String },
    rgst: { 
        cls1: {
            name:{type: String},
            dept:{type: Number},
            levl:{type: Number}
              },
        cls2: {
            name:{type: String},
            dept:{type: Number},
            levl:{type: Number}
              }
    }
}, { timestamps: true });

const Skedj = mongoose.model('Skedj', skedjSchema);
module.exports = Skedj;

//when create new login with yous=="S", also make this class schedule to go with them