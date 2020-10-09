const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //req.body'leri kullanabilmek için.
const slugify = require('slugify')
const jwt = require('jsonwebtoken'); //Web token
const Todo = require('../models/todo');

//İlan ekleme
router.post('/create', (req, res, next) => {
   var token = req.headers.authorization.split(' ')[1]; //token
   var decoded = jwt.verify(token, "secret");  //token'a ait bilgileri getirdik (email,userId) => https://jwt.io/
   const todo = new Todo({
      _id: new mongoose.Types.ObjectId(),
      user: decoded.userId, //modelde ref olarak verdiğimiz user.
      title: req.body.title,
      slug: slugify(req.body.title),
      detail: req.body.detail,
      category: req.body.category,
      price: req.body.price,
      howMany: req.body.howMany,
      country: req.body.country,
      district: req.body.district,
      startedDate: req.body.startedDate,
      finishedDate: req.body.finishedDate
   });
   todo.save().then(result => {
      res.status(200).json({
         message: "Yeni bir ilan yayınlandı",
      })
   }).catch(err => {
      res.status(500).json({
         message: err
      })
   })
})

//Tüm ilanları getirir.
router.get('/list', (req, res, next) => {
   Todo.find({status:0}).exec().then(value => { //userId'si token'dan gelen userId'ile eşleşen todo'yu getirir. Kullanıcı bazlı getirme olayı..
      res.status(200).json({
         data: {
            count: value.length,
            list: value
         }
      })
      res.status(500).json({
         data: {
            message: "Listeleme sırasında bir hata oluştu"
         }
      })
   })
})


//Benin ilanlarım
router.get('/myTodos', (req, res, next) => {
   var token = req.headers.authorization.split(' ')[1]; //token
   var decoded = jwt.verify(token, "secret");  //token'a ait bilgileri getirdik (email,userId) => https://jwt.io/
   Todo.find({ user: decoded.userId }).exec().then(value => {
      res.status(200).json({
         data:value
      })
   })
})

//slug değerine göre ilan detayını getirir.
router.get('/list/:slug', (req, res, next) => {
   const todoTitleSlug = req.params.slug;
   Todo.find({ slug: todoTitleSlug }).select('user _id title category detail price howMany applicantCount country district startedDate finishedDate')
      .populate('user').exec().then(value => {
         res.status(200).json({
            data: value.map(values => {
               return {
                  _id: values._id,
                  title: values.title,
                  detail: values.detail,
                  category: values.category,
                  price: values.price,
                  howManyPeopleDo: values.howMany,
                  country: values.country,
                  district: values.district,
                  startedDate: values.startedDate,
                  finishedDate: values.finishedDate,
                  applicantCount: values.applicantCount,
                  createdUserId:values.user._id,
                  userName: values.user.userName,
                
               }
            })
         })
      })
})

//todId değerine göre ilanı siler.
router.delete('/:todoId', (req, res, next) => {
   Todo.findByIdAndRemove({ _id: req.params.todoId }).exec().then(value => {
      res.status(200).json({
         message: "İlan silindi"
      })
   }).catch(err => {
      res.status(500).json({
         error: err
      })
   })
})

module.exports = router;
