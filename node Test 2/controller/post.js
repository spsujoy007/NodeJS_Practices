const {Post} = require('../model/makeUser');
const createpost = (req, res) =>{
    const {title, details, author} = req.body;
    const newPost = new Post({
      title,
      details,
      author
    })
    newPost.save()
    res.send(newPost)
}

module.exports = {createpost}