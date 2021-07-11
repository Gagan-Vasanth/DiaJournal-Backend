const express = require('express');
const User = require('../../schemas/User');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');


router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

router.post('/login',[
    check('email', 'Please Enter a valid email').isEmail(),
    check('password', 'Please Choose your password with 6 or more characters').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() })
    }
    
    const { email, password } = req.body;
    
    try {
        //See if the user already exists
        let user = await User.findOne({ email });

        if(!user) {
           return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]})
        }
        
        const isMatch = bcrypt.compare(password, user.password)

        if(!isMatch) {
           return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]})
        }


        //Return JsonWebToken  
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 36000 },
            ( err, token ) => {
                if(err) throw err;
                res.json({ token });
            }
        )

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    
})


module.exports = router;