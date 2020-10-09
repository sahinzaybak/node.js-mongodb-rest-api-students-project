const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TodoCategory = require('../models/todo-category');

//İlan kategorileri ekle (yazılım,içerik,ders..s)
router.post("/", (req, res, next) => {
   const category = new TodoCategory({
      _id: new mongoose.Types.ObjectId(),
      category: req.body.category
   });
   category.save().then(value => {
      res.status(200).json({
         message: "Kategori Ekledi",
         data: value
      })
   }).catch(err => {
      res.status(500).json({
         error: err
      })
   })
})

// İlan kategorilerini listele
router.get("/", (req, res, next) => {
   TodoCategory.find().exec().then(value => {
      res.status(200).json({
         category: value
      })
   }).catch(err => {
      res.status(500).json({
         error: err
      })
   })
})


module.exports = router;