const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET = process.env.SECRET_KEY

module.exports.hash = (password) => {
    return (crypto
            .createHmac('sha256', SECRET)
            .update(password)
            .digest('hex')
            .split('')
            .reverse()
            .join('')
    )
}
module.exports.jsonAuth = (req, res, next)  => {
    const token = req.body.token
    jwt.verify(token, SECRET, (err, user) => {
        if(err){
            res.sendStatus(403)
        } else {
            if(user.username === req.body.username){
                res.locals.user = user.username
                next()
            } else {
                res.sendStatus(401)
            }
        }
    })
}


module.exports.auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if(authHeader){
        const token = authHeader.split(' ')[1]
        jwt.verify(token, SECRET, (err, user) => {
            if(err){
                res.sendStatus(403)
            } else {
                console.log(user)
                if(user.username === req.body.username){
                    res.locals.user = user.username
                    next()
                } else if(req.method === 'GET' || req.method === 'DELETE') {
                    res.locals.user = user.username
                    next()
                } else {
                    res.sendStatus(401)
                }
            }
        })
    } else {
        res.sendStatus(401)
    }
}