const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./model/registrationModel');


mongoose.connect('mongodb+srv://GlobalServerPrac:atHaLf7FtMqWha6e@cluster0.6ke0m0t.mongodb.net/practicenode?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Database Connected!')
});

// middleware
app.use(express.json())
app.use(cors())

app.post('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
    const {name, pass} = req.body;
    if(name!="" && pass !=""){
        let registration = new User({
            name: name,
            pass: pass
        })
        registration.save()
        res.send(registration)
    }
    else
        res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})