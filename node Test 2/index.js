const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose');

// controllers 
const {createpost} = require('./controller/post');
const registerUser = require('./controller/registration')

const secureApi = require('./middleware/secureApi');
app.use(express.json())

// tables 
const {User, Post} = require('./model/makeUser');

mongoose.connect('mongodb+srv://GlobalServerPrac:atHaLf7FtMqWha6e@cluster0.6ke0m0t.mongodb.net/practicenode?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB Connected!')
});

// middleware 

app.get('/', (req, res) => {
  res.send('Hello World! This is node')
})


// authorization system 
app.get('/message', secureApi, (req, res) =>{
  console.log('Main message!');
})

app.post('/adduser', registerUser)

app.get('/user/:id', async(req, res) =>{
    const data = await User.findById(req.params.id);
    console.log(data);
    bcrypt.compare('123456', data.password, function(err, result) {
      // result == true
      const userdata = {
        name: data.name,
        email: data.email,
        id: data._id,
        password: result
        // _id,
      }
      res.send(userdata)
  });
})

app.post('/makepost', createpost)

app.put('/updatepost/:id', async(req, res)=>{
  try {
    const id = req.params.id;

    // when you want to update data instantly and it should be shown in response then use "{new: true}"
    const updatepost = await Post.findByIdAndUpdate(id, req.body, {new: true})
    res.send(updatepost)
  } catch (error) {
    console.log(error);
  }
})

app.get('/mypost/:id', async(req, res)=>{
  // get user by post
  res.send(await Post.findById(req.params.id).populate('author'))
})

app.get('/allposts', async(req, res) =>{
  const result = await Post.find({_id: "66b23d74ca295e9ede320249"})
  res.send(result)
})

app.delete('/deleteuser/:id', async(req, res)=>{
  const userid = req.params.id
  const deleteuser = await User.findByIdAndDelete(userid)
  if(deleteuser){
    res.send("user deleted");
  }
  else{
    res.send("faild to delete");
  }
  Post.deleteMany({author: userid}).then(() =>{
    res.send('Post deleted');
  }).catch(e =>{
    res.send(e);
  })
})


app.listen(port)