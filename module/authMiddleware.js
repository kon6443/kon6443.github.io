const jwt = require('jsonwebtoken');
const path = require('path');
// calling enviroment variable from .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

exports.auth = (req, res, next) => {
    // 인증 완료
    try {
        // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
        req.decoded = jwt.verify(req.cookies.user, process.env.SECRET_KEY);
        return next();
    }
    // 인증 실패
    catch (error) {
        // 유효시간이 초과된 경우
        if (error.name === 'TokenExpiredError') {
            console.log('auth TokenExpiredError');
            // return res.status(419).json({
            //     code: 419,
            //     message: 'Token has been expired.'
            // }); 
        }
        // 토큰의 비밀키가 일치하지 않는 경우
        if (error.name === 'JsonWebTokenError') {
            console.log('JsonWebTokenError');
            next();
            return res.status(401).json({
                code: 401,
                message: 'Invalid token.'
            });
        }
        // next();
        return error.name;
    }
}