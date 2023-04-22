const express =require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');
const router = express.Router();

//POST /auth/join
//auth + /join

//회원가입과 로그인은 로그인 안한 사람만 가능 구분 접근 가능한 라우터가 다르기 떄문
//POST /auth/join
router.post('/join', isNotLoggedIn, join);

//POST /auth/login
router.post('/login', isNotLoggedIn, login);

//로그인 한 사람 구분
//GET /auth/logout
router.get('/logout', isLoggedIn, logout);

module.exports = router;