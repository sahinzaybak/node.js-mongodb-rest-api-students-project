const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   category: { type: String},
});

module.exports = mongoose.model('todo-category', categorySchema);

