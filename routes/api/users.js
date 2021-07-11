const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../schemas/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/',[
    check('name', 'Please Enter the Name').not().isEmpty(),
    check('email', 'Please Enter a valid email').isEmail(),
    check('password', 'Please Choose your password with 6 or more characters').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array() })
    }
    
    const { name, email, password } = req.body;
    
    try {
        //See if the user already exists
        let user = await User.findOne({ email });

        if(user) {
           return res.status(400).json({ errors: [{ msg: 'User already exists'}]})
        }
        //Get users gravatar

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        }); 

        //Encrpyt Password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

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