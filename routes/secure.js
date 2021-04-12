const express = require('express');
 

const router = express.Router();



router.post('/submit-score', (req, res, next) => {
     res.json({
        message: '404 - Not Found(совсем нет)'
    });
});



router.get('/scores', (req, res, next) => {
     res.json({
        message: '404 - Not Found(совсем нет)'
    });
});


module.exports = router;