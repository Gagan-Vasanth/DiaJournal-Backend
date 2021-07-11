const express = require('express');
const Journal = require('../../schemas/Journal');
const router = express.Router();
const User = require('../../schemas/User');

router.post('/postJournalsById', async (req, res) => {
    const { email, data } = req.body;
    try {
        console.log('The user data is ' + req.body.email);
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(201).send('No user found');
        }
        
        journal = new Journal({
            email,
            data,
        });
        console.log(journal);
        await journal.save();

        return res.status(200).send('Journal Submitted successfully');    
    

        
    } catch(err){
        console.log('No Id found for this user');
        res.status(500).send('Server Error');
    }
});

router.post('/getJournalsById', async(req, res) => {
    const { email } = req.body;
    
    try {
        console.log(req.body.email);
        let user = await User.findOne({ email });

        if(!user){
            return res.status(200).send('No user found');
        }
         
        const journals= await Journal.find({ email });
        console.log(journals);
        return res.status(200).json({ journal: journals });

    } catch(err) {
        res.status(501).send('Server error');
    }
})

module.exports = router;