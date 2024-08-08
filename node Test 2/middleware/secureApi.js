 let secureApi = (req, res, next) =>{
    // console.log("I am in middle ware!");
    // next()
    console.log(req.headers.authorization);
    if(req.headers.authorization == 'fk4554fdfkejjcfkll'){
        next()
    }
    else{
        res.send("Authorization Failed!");
    }
 }

 module.exports = secureApi