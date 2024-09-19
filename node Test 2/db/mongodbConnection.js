const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://GlobalServerPrac:atHaLf7FtMqWha6e@cluster0.6ke0m0t.mongodb.net/practicenode?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  console.log('MongoDB Connected!')
});