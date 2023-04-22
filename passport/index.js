const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => { //user == exUser
        done(null, user.id);
    });
    // {랜덤한 값 발급 : 내아이디는 1번이다} ->세션은 이런 객체 { 세션쿠키 : 유저아이디 } -> 메모리 저장
    // 유저정보를 통째로 저장하면 메모리가 너무 커짐!(유저수가 많아질수록)
    //모두 저장할 수 없으니 유저아이디만 추출
    //done(null, user.id); user.id를 user로 할 시 전부 통쨰로 가져옴

    passport.deserializeUser((id, done) => { //id :1로 넘어옴 
        User.findOne({ where: { id }})
            .then(user => done(null, user)) //req.user, req.session
            .catch(err => done(err));
    });
    local();
};
//정확히는 connect.sid 쿠키로 세션에서 찾을 때 req.session이 생성됩니다.