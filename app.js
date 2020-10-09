const express = require('express');
const app = express();
const morgan = require('morgan'); //not found(404) ve eror(500) mesajları için.
const bodyParser = require('body-parser'); //req.body'leri kullanabilmek için.
const mongoose = require('mongoose');


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
})

//Requests
const userRoutes = require('./api/routes/user');
const todoRoutes = require('./api/routes/todo');
const todoApplicantRoutes = require('./api/routes/todo-applicant');
const todoCategoryRoutes = require('./api/routes/todo-category');
const todoSelectPersonRoutes = require('./api/routes/todo-select-person');
const userDiscussRoutes = require('./api/routes/user-discuss');
app.use('/user', userRoutes);
app.use('/todo', todoRoutes);
app.use('/todoApplicant', todoApplicantRoutes);
app.use('/todoCategory', todoCategoryRoutes);
app.use('/todoSelectPerson', todoSelectPersonRoutes);
app.use('/userDiscuss', userDiscussRoutes);

//Sayfa bulunamadı hatası (404)
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

//Herhangi bir hata olduğunda hatayı görmek için (500)
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ error: { message: error.message } })
})

module.exports = app;