const User = require('../auth/auth-model')

async function checkUsernameFree(req, res, next) {
    try {
      const users = await User.findBy({username: req.body.username})
      if(!users.length) {
        next()
      } else {
        res.status(422).json({message: 'username taken'})
      }
    }catch(err) {
      next(err)
    }
  }
  
function checkCredentials(req, res, next) {
    try {
        if(!req.body.username || !req.body.password) {
            res.status(401).json({message: 'username and password required'})
        } else {
            next()
        }
    }catch(err) {
        next(err)
    }
}

  async function checkUsernameExists(req, res, next) {
    try {
      const users = await User.findBy({username: req.body.username})
      if(users.length) {
        req.user = users[0]
        next()
      } else {
        res.status(401).json({message: 'invalid credentials'})
      }
    }catch(err) {
      next(err)
    }
  }
  

module.exports = {
    checkUsernameExists,
    checkUsernameFree,
    checkCredentials
}