const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); //Web token
//Models
const TodoApplicant = require('../models/todo-applicant');
const Todo = require('../models/todo');

//İlana aday ol
router.post("/", (req, res, next) => {
   var token = req.headers.authorization.split(' ')[1]; //token
   var decoded = jwt.verify(token, "secret");  //token'a ait bilgileri getirdik (email,userId) => https://jwt.io/
   const applicant = new TodoApplicant({
      _id: new mongoose.Types.ObjectId(),
      todo: req.body.todoId,
      message: req.body.message,
      user: decoded.userId, //ilana aday olan..giriş yapan kullanınıcın token'daki userId bilgisi. (Vue'da axios.bearer kodları buraya etkiliyor.)
      applicantOwner: req.body.applicantOwner
   });
   applicant.save().then(value => { //ilan başvuru form
      applicantCountIncrease(value); //ilana başvuru sayısını arttır. (fonksiyon)
      res.status(200).json({
         message: value //sadee ID'leri verir. GET: methodunda ise select ve populate kullanarak detayları görebiliyoruz.
      })
   }).catch(err => {
      res.status(500).json({
         error: err
      })
   })
});

//Aday olunan ilanları getirir. => ilan detay, ilan açıklaması
router.get("/", (req, res, next) => {
   var token = req.headers.authorization.split(' ')[1]; //token
   var decoded = jwt.verify(token, "secret");  //token'a ait bilgileri getirdik (email,userId) => https://jwt.io/
   TodoApplicant.find({ user: decoded.userId }).select('todo message').populate('todo').exec()
      .then(value => { //=> populate-> tüm bilgileri getirir.
         res.status(200).json({
            count: value.length,
            applicantList: value.map(values => {
               return {
                  applicantId: values._id,
                  applicantUserMessage: values.message,
                  applicantInfo: values.todo
               }
            })
         })
      })
});

//ilana aday olan kişilerin listesi (ilan Id)
router.get("/:todoId", (req, res, next) => {
   var token = req.headers.authorization.split(' ')[1]; //token
   var decoded = jwt.verify(token, "secret");  //token'a ait bilgileri getirdik (email,userId) => https://jwt.io/
   //ilan sahibinin(applicantOwner) && ilanlarını getir(todo)
   TodoApplicant.find({ applicantOwner: decoded.userId, todo: req.params.todoId }).populate('user todo').exec().then(value => {
      res.status(200).json({
         count: value.length,
         data: value.map(values => {
            return {
               _id: new mongoose.Types.ObjectId(),
               todoName: values.todo.title,
               todoPrice: values.todo.price,
               todoOwner: values.applicantOwner, //ilan sahibi
               applicantUser: values.user.userName,
               slug: values.user.slug,
               applicantUserId: values.user._id,
               applicantUniversity: values.user.university.universityName,
               applicantDepartment: values.user.university.department,
               message: values.message,
            }
         })
      })
   }).catch(err => {
      res.status(500).json({
         error: err
      })
   })
});


//ilana aday olan kişilerin listesi -- detay (ilan Id / ilana aday olan kişinin slug bilgisi)
router.get("/:todoId/:applicantUserSlug", (req, res, next) => {
   var token = req.headers.authorization.split(' ')[1]; //token
   var decoded = jwt.verify(token, "secret");  //token'a ait bilgileri getirdik (email,userId) => https://jwt.io/
   TodoApplicant.find({ applicantOwner: decoded.userId, todo: req.params.todoId }).populate('user todo').exec().then(value => {
      var oneTodoApplicant = value.filter(x => x.user.slug == req.params.applicantUserSlug);
      res.status(200).json({
         data: oneTodoApplicant.map(values => {
            return {
               _id: new mongoose.Types.ObjectId(),
               todoName: values.todo.title,
               todoPrice: values.todo.price,
               todoOwner: values.applicantOwner, //ilan sahibi
               applicantUser: values.user.userName,
               slug:values.user.slug,
               applicantUserId: values.user._id,
               applicantUniversity: values.user.university.universityName,
               applicantDepartment: values.user.university.department,
               message: values.message,
            }
         })
      })
   }).catch(err => {
      res.status(500).json({
         error: err
      })
   })
})

//ilana başvuru saysını arttıran fonksiyon
function applicantCountIncrease(applicant) {
   Todo.find({ _id: applicant.todo }).then(value => { //ilanı bul
      var _applicantCount = value[0].applicantCount; //İlandaki aday sayısı
      var sumApplicantCount = ++_applicantCount; //Aday saysını 1 arttır.
      Todo.updateOne({ _id: applicant.todo }, { $set: { applicantCount: sumApplicantCount } }).then(values => { //$set, sadece belli alanı update.
         console.log(values)
      })
   })
}

module.exports = router;