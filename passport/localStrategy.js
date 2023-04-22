const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require("../models/user");

//bcrypt 장점은 암호화랑 비교 해줌
//done이 호출되는 순간 controllers/auth exports.login (authError, user, info)로 넘어감 
module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', //req.body.email
        passwordField: 'password', // req.bodt.password
        passReqToCallback: false
        //passReqToCallback: true -> 아래 async에 req가 들어가니 매개변수에 req추가
        //passReqToCallback: false -> 아래 async에 req가 빠짐

    },
    // 로그인을 시켜야되는지 말아야되는지 판단
    // done(서버실패, 성공유저, 로직실패)
    //서버실패란 DB요청이 실패하거나 문법이 틀렸을 경우 애초에 시스템이 망가질 경우의 에러
    //성공유저 exUser,result 통과했다 의 경우
     async (email, password, done) => { // done(서버실패, 성공유저, 로직실패)
        try {
             const exUser = await User.findOne({ where : { email } });
             if (exUser) {
                //password는 req.password고 exUser.password는 DB
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    //로직실패 : 서버에 에러도 없는데 로그인을 시켜주면 안되는 경우
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
             } else {
                done(null, false, { message: '가입하지 않은 회원입니다.' });
             }
        } catch (error) {
            console.error(error);
            //서버실패
            done(error);
        }
     }));
};