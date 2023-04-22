const express = require('express');
const router = express.Router();
const { renderProfile, renderJoin, renderMain } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
    next();
});

router.get('/profile', isLoggedIn ,renderProfile);//로그인 한 사람만 랜더링


router.get('/join', isNotLoggedIn ,renderJoin);//로그인 안한 사람만 회원가입 가능 

router.get('/', renderMain);

module.exports = router;