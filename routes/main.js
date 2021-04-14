const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const tokenList = {};

const router = express.Router();
// груптруем здесь все роутеры

router.get('/status', (req, res, next) => {
  console.log(req.user)
  res.status(200);
  res.json({
    status: 'ok work',
    user: req.user,
    token: req.query.secret_token,
  });
});

router.post('/signup', (req, res) => {
  res.status(200).json({
    status: 'ok signup',
    message: 'signup',
    user: req.user,
    status: res
  });
});

router.post('/login', (req, res) => {
  console.log(req)
  res.status(200).json({
    status: 'ok login',
    message: 'login',
    user: req.user,
    status: res
  });
});

router.post('/logout', (req, res) => {
  res.status(200).json({
    message: 'logged out'
  });
});

router.post('/token', (req, res) => {
  const {
    email,
    refreshToken
  } = req.body;

  if ((refreshToken in tokenList) && (tokenList[refreshToken].email === email)) {
    const body = {
      email,
      _id: tokenList[refreshToken]._id
    };
    const token = jwt.sign({
      user: body
    }, 'top_secret', {
      expiresIn: 300
    });

    // обновляем jwt
    res.cookie('jwt', token);
    tokenList[refreshToken].token = token;

    res.status(200).json({
      token
    });
  } else {
    res.status(401).json({
      message: 'Unauthorized *token не пришёл'
    });
  }
});


module.exports = router;