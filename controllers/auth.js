const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require("../models/user");


//회원가입은 패스포트와 관련이 없음
// /auth/join
exports.join = async (req, res, next) => {
    //join.html에서 /auth/join에 post방식으로 이메일,닉네임,비밀번호를 보내는데
    //이건 req.body에 담김
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email }});
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/'); //status 302
    } catch (error) {
        console.error(err);
        next(error);
    }
}

//POST /auth/login
exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) { //서버실패
            console.error(authError);
            return next(authError);
            //서버 에러는 next로 에러처리 미들웨어에서 알아서 하도록
        }
        if(!user) { //로직실패
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => { //로그인성공
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res,next);
};

//로그아웃은 세션쿠기가 Ex{ 123213112:1 } 있는데 세션에서 세션쿠키를 없애버림
exports.logout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    })
};