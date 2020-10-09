const mongoose = require('mongoose');
const userDiscussSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   discussOwnerId: { type: String, required: true },
   todo: { type: mongoose.Schema.Types.ObjectId, ref: 'todo' }, //'todo' şemasını referans gösterdik, ki todo bilgilerini alabilelim.
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
   star: { type: Number, required: true },
   discussType: { type: String, required: true },
   message: { type: String, required: true },
});

module.exports = mongoose.model('userDiscuss', userDiscussSchema);

