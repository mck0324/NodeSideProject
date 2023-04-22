const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
sequelize.sync({ force: false})
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    })

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());//req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false }));//req.body를 프론트 form태그 안에 데이터를 보내줌
app.use(cookieParser(process.env.COOKIE_SECRET)); // {connect.sid = 랜덤수}
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout이 여기서 생기는거임
//패스포트가 로그인을 위해 필요한 애들을 자동으로 생성
app.use(passport.session());//connect.sid라는 이름으로 세션 쿠기가 브라우저로 전송(쿠키로 로그인)
//브라우저 connect.sid = 13241241215랜덤수 가 서버로옴 그럼 cookieParser가 분석

app.use('/', pageRouter);
app.use('/auth', authRouter);


app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.err = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
})