//ES5
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
// const bootstrap = require('bootstrap')
const fs =  require('fs')
const crypto = require('crypto')//generate file names
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const app = express()

mongoose.connect('mongodb://localhost:27017/notesquaredemo')
const db = mongoose.connection //the connection is stored to a variable to help test the connection situation

db.on('error', function(err){   //in case of an error, console.log the problem
    console.log(err)
})

db.once('open', function(){     //if connection is open, console.log confirmation.
    console.log('database connection established')
})

const Note = require('./models/notemodel')

//morgan logs errors and requests 
app.use(morgan('dev'))

//bodyparser can process both data incoming in urlencoded AND Json format.
app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())

app.set('view engine', 'ejs')

//upload multer middleware
const upload = require('./middleware/upload')

app.get('/', function(req, res){
    res.redirect('/notes')
})

app.get('/notes', function(req, res){

    Note.find({}, function(err, notes){
        if(err){
            console.log(err)
        }else{
            //res.json(notes)
            res.render('notes/index', {notes: notes})
        }
    })
})

app.get('/notes/new', function(req, res){
    res.render('notes/new')
})

// app.get('/notes/:grade', function(req, res){
//     Note.find({grade: req.params.grade}, function(err, notes){
//         if(err){
//             console.log(err)
//             res.redirect('/notes')
//         }else{
//             res.render('notes/filterIndex', {notes:notes})
//         }
//     })
// })

app.post('/notes', function(req, res){
    Note.create(req.body.post, function(err, newPost){
        if(err){
            res.render('notes/new')
        }else{
            res.redirect('/notes')
        }
    })
})

app.get('/notes/:id', function(req, res){
    Note.findById(req.params.id, function(err, foundNote){
        if(err){
            console.log(err)
        }else{
            res.render('notes/show', {note: foundNote})
        }
    })
})

const port = process.env.PORT || 3000
app.listen(port, function(){
    console.log('listening in port 3000.')
})
