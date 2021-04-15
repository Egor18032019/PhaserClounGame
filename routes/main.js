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

router.post('/login',
  async (req, res, next) => {
    console.log(req.body, "main.js stroke 30")

    passport.authenticate('login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            next(error)
            const error = new Error('An Error occured');
            return next(error);
          }
          req.login(user, {
            session: false
          }, async (error) => {
            if (error) {
               return next(error);
            }
            const body = {
              _id: user._id,
              email: user.email
            };

            const token = jwt.sign({
              user: body
            }, 'top_secret', {
              expiresIn: "30m"
            });
            const refreshToken = jwt.sign({
              user: body
            }, 'top_secret_refresh', {
              expiresIn: 86400
            });

            // сохраняем токены в cookie
            res.cookie('jwt', token);
            res.cookie('refreshJwt', refreshToken);
            // и имя пользователя
            res.cookie('name', user.name);
            res.cookie('email', user.email);
            // Примечание: в этом руководстве мы храним эти токены в памяти, но на практике вы лучше хранить эти данные в постоянном хранилище определенного типа.

            // сохраняем токены в памяти
            tokenList[refreshToken] = {
              token,
              refreshToken,
              email: user.email,
              _id: user._id
            };
            return res.redirect("/game.html");
          });
        } catch (error) {
          console.log("error main 77")
          res.send("Неправильный пароль или емайл");
        }
      })(req, res, next);
    /*В функции обратного вызова мы сначала проверяем, была ли какая-то ошибка или объект user не был возвращен 
    из промежуточного программного обеспечения passport.
     Если эта проверка верна, мы создаем новую ошибку и передаем ее следующему промежуточному программному обеспечению.
    Если эта проверка ложна, мы вызываем метод login, который предоставляется в объекте req. Этот метод добавляется паспортом автоматически.
     Когда мы вызываем этот метод, мы передаем объект user, объект options и функцию обратного вызова в качестве аргументов.
    В функции обратного вызова мы создаем два веб-токена JSON с помощью библиотеки jsonwebtoken. Для JWT мы включаем идентификатор и 
    адрес электронной почты пользователя в данные JWT, и мы устанавливаем срок действия основного токена в пять минут, 
    а срок действия refreshToken - через один день.
    Затем мы сохранили оба этих токена в объекте ответа, вызвав метод cookie, и сохранили эти токены в памяти,
    чтобы мы могли ссылаться на них позже при обновлении токена.  */
  });


router.post('/logout', (req, res) => {
  res.status(200).json({
    status: 'ok logout',
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