const mongoose = require('mongoose');
const todoSelectPersonSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   todoOwnerId: { type: String, required: true },
   todo: { type: mongoose.Schema.Types.ObjectId, ref: 'todo' },
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
   isTodoDoing: { type: String },
});

module.exports = mongoose.model('todo-select-person', todoSelectPersonSchema);

