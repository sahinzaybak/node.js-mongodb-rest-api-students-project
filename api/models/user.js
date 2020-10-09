const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   userName: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   slug: {
      type: String,
      required: true
   },
   university: {
      universityName: {
         type: String,
         default:""
      },
      department: {
         type: String,
         default:""
      },
      universityEmail: {
         type: String,
         default:""
      },
      phone: {
         type: String,
         default:""
      },
      iban: {
         type: String,
         default:""
      },
      universityClass: {
         type: String,
         default:""
      },
   },
   about:{
      aboutText:{
         type:String,
         default:""
      },
      wantCategories:{
         type:Array,
         default:""
      }
   }
});

module.exports = mongoose.model('user', userSchema);

