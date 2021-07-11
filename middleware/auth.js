const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function ( req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if not token 
    if(!token){
        return res.send(401).json({ msg: 'No token, authorization denied!'});
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user; // If we decode the token with jwt.verify we get the id of user and we can store that in req.user because this 
                                    // is a GET request without any data with body
        next();
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid'})
    }
};