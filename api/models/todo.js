const mongoose = require('mongoose');
const todoSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   status: { type: Number, required: true, default:0 },
   title: { type: String, required: true },
   slug : { type: String, required: true },
   detail: { type: String, required: true },
   category: { type: String, required: true },
   price: { type: Number, required: true },
   howMany: { type: String, required: true },
   country: { type: String, required: true },
   district: { type: String, required: true },
   startedDate: { type: String, required: true },
   finishedDate: { type: String, required: true },
   applicantCount: { type: Number, default: 0},
   user: { type:mongoose.Schema.Types.ObjectId, ref:'user', required:true },
});

module.exports = mongoose.model('todo', todoSchema);

