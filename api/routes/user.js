const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //req.body'leri kullanabilmek için.
const bcrypt = require('bcrypt'); //şifre hash.
const jwt = require('jsonwebtoken'); //Web token

const User = require('../models/user');

//Kullanıcı Ekle
router.post('/signup', (req, res, next) => { // => /user/signUp
   User.find({ email: req.body.email }).exec().then(value => {
      if (value.length >= 1) return res.status(409).json({ message: "Bu e-mail adresi zaten kayıtlı" }) //eğer aynı email adresinde kullanıcı varsa hata ver.
      else {
         bcrypt.hash(req.body.password, 10, (err, hash) => { //Şifreyi hashla.
            const user = new User({
               _id: new mongoose.Types.ObjectId(),
               userName: req.body.userName,
               email: req.body.email,
               password: hash,
               slug: slugify(req.body.userName),
               university: {
                  universityName: req.body.universityName,
                  department: req.body.department,
                  universityEmail: req.body.universityEmail,
                  phone: req.body.phone,
                  IBAN: req.body.iban,
                  univerisityClass: req.body.universityClass
               },
               about: {
                  aboutText: req.body.aboutText,
                  wantCategories: req.body.wantCategories,
               }
            });
            user.save().then(result => {
               res.status(200).json({
                  message: "Kullanıcı eklendi",
                  info: user,
               })
            }).catch(err => {
               res.status(500).json({
                  error: err
               })
            })
         })
      }
   })
});


//Kullanıcı Girişi
router.post("/login", (req, res, next) =>
   User.find({ email: req.body.email, password: req.body.password }).exec() //Email ve password kontrol
      .then(value => {
         if (value.length < 1) return res.status(401).json({ data: { message: "Kullanıcı bulunamadı" } })
         else {
            const _token = jwt.sign({ // Kullanıcı giriş yaptığında token üretme
               email: value[0].email,
               userId: value[0]._id
            }, "secret", { expiresIn: "5h" });
            return res.status(200).json({
               data: {
                  message: "Tebrikler. Giriş yapıldı!",
                  info: value,
                  token: _token
               }
            })
         }
      }).catch(err =>
         res.status(500).json({
            error: err
         }))
)

//ID'ye göre GÜNCELLEME
router.put('/:userId', (req, res, next) => {
   const userId = req.params.userId;
   User.findByIdAndUpdate({ _id: userId }, req.body).exec()
      .then(value => {
         res.status(200).json({
            message: "Güncelleme işlemi başarı ile gerçekleşti."
         })
      }).catch(err => {
         res.status(500).json({
            message: err
         })
      })
});

//ID'ye göre Veri SİL
router.delete('/:userId', (req, res, next) => {
   const id = req.params.userId;
   User.findByIdAndRemove(id).exec()
      .then(value => res.status(200).json({
         message: "Kullanıcı başarı ile silindi."
      }))
      .catch(err =>
         res.status(500).json({
            error: err
         }))
});

router.get('/:userSlug', (req, res, next) => {
   User.findOne({ slug: req.params.userSlug }).exec()
      .then(value => {
         res.status(200).json({
            data: value
         })
      }).catch(err => {
         res.status(500).json({
            error: err
         })
      })
})

module.exports = router;

