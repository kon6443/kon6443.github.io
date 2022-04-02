const jwt = require('jsonwebtoken');
const path = require('path');
// importing .env file
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
        // Token has been expired
        if (error.name === 'TokenExpiredError') {
            console.log('auth TokenExpiredError');
            next();
            // return res.status(419).json({
            //     code: 419,
            //     message: 'Token has been expired.'
            // }); 
        }
        // JsonWebTokenError
        if (error.name === 'JsonWebTokenError') {
            console.log('JsonWebTokenError');
            next();
            // return res.status(401).json({
            //     code: 401,
            //     message: 'Invalid token.'
            // });
        }
    }
}