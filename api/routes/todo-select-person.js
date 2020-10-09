const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); //Web token
//Models
const TodoSelectPerson = require('../models/todo-select-person');
const Todo = require('../models/todo');

//Adayı Seç
router.post("/", (req, res, next) => {
   var token = req.headers.authorization.split(' ')[1];
   var decoded = jwt.verify(token, "secret");
   const selectPerson = new TodoSelectPerson({
      _id: new mongoose.Types.ObjectId(),
      todoOwnerId: decoded.userId,
      todo: req.body.todoId,
      user: req.body.userId,
      isTodoDoing: ''
   });
   selectPerson.save().then(value => {
      todoUpdateStatus(value.todo); //Eğer bir aday seçilmişse o ilanın status değerini 1 yap ve listede gösterme..
      res.status(200).json({
         message: "success",
         data: value
      })
   }).catch(err => {
      res.status(500).json({
         error: err
      })
   })
})

//İlana seçilen kişinin bilgileri
router.get("/:todoId", (req, res, next) => {
   var token = req.headers.authorization.split(' ')[1];
   var decoded = jwt.verify(token, "secret");
   TodoSelectPerson.find({ todo: req.params.todoId, todoOwnerId: decoded.userId }).populate('todo user').exec()
      .then(value => {
         res.status(200).json({
            data: value.map(values => {
               return {
                  _id: new mongoose.Types.ObjectId(),
                  todoName: values.todo.title,
                  todoDetail: values.todo.detail,
                  price: values.todo.price,
                  applicantUserId: values.user._id,
                  applicantUniversity: values.user.university.universityName,
                  applicanDepartment: values.user.university.department,
                  applicantUserName: values.user.userName,
                  applicantPhone: values.user.university.phone,
                  applicantIBAN: values.user.university.iban,
                  isTodoDoing: values.isTodoDoing
               }
            })
         })
      }).catch(err => {
         res.status(500).json({
            error: err
         })
      })
});


//İlana Seçilen aday görevi tamamladı mı ? isTodoDoing ve Görüş gir..
router.put("/confirm", (req, res, next) => {
   TodoSelectPerson.findOneAndUpdate({ user: req.body.selectedApplicantId }, { isTodoDoing: req.body.isTodoDoing }).exec()
      .then(value => {
         res.status(200).json({
            message: "güncellendi"
         })
      }).catch(err => {
         res.status(500).json({
            error: err
         })
      })
});


//Eğer bir aday seçilmişse o ilanın status değerini 1 yap ve listede gösterme..
function todoUpdateStatus(_todoId) {
   console.log(_todoId)
   Todo.findByIdAndUpdate({ _id: _todoId }, { status: 1 }).exec().then(value => {
      console.log(value)
   })
}

module.exports = router;