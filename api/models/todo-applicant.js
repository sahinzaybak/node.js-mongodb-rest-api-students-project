const mongoose = require('mongoose');
const todoApplicantSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   todo: { type:mongoose.Schema.Types.ObjectId, ref:'todo' }, //'todo' şemasını referans gösterdik, ki todo bilgilerini alabilelim.
   user: { type:mongoose.Schema.Types.ObjectId, ref:'user' },
   message: { type: String, required: true },
   applicantOwner: { type: String, required: true },
});

module.exports = mongoose.model('todoApplicant', todoApplicantSchema);

