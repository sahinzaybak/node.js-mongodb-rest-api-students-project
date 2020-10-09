const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); //Web token
//Models
const UserDiscuss = require('../models/user-discuss');
const User = require('../models/user');


//İşi yaan aday için görüş bildir.
router.post('/', (req, res, next) => {
   var token = req.headers.authorization.split(' ')[1]; //token
   var decoded = jwt.verify(token, "secret");  //token'a ait bilgileri getirdik (email,userId) => https://jwt.io/
   const discuss = new UserDiscuss({
      _id: new mongoose.Types.ObjectId(),
      discussOwnerId: decoded.userId,
      todo: req.body.todoId,
      user: req.body.applicantUserId,
      star: req.body.star,
      discussType: req.body.discussType,
      message: req.body.message
   });
   discuss.save().then(value => {
      res.status(200).json({
         data: value
      })
   }).catch(err => {
      res.status(500).json({
         error: err
      })
   })
});

//Kullanıcıya ait yorumları getir
router.get("/:userId", (req, res, next) => {
   UserDiscuss.find({ user: req.params.userId }).populate("todo").exec()
      .then(value => {
         User.find({ _id: value[0].discussOwnerId }).exec().then(discussOwner => {
            res.status(200).json({
               count: value.length,
               data: value.map(values => {
                  return {
                     _id: new mongoose.Types.ObjectId(),
                     discussOwner: discussOwner[0].userName,
                     todo: values.todo.title,
                     star: values.star,
                     discussType:values.discussType,
                     message: values.message,
                  }
               })
            })
         })
      }).catch(err => {
         res.status(500).json({
            error: err
         })
      })


})

module.exports = router;