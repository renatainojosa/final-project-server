const { expressjwt: jwt } = require('express-jwt');

const getTokenFromHeaders = (req) => {

    const { authorization } = req.headers;
    if(!authorization) return null;

    const [type, token] = authorization.split(' ');
    if(type === 'Bearer') return token;

    return null;
}

const isAuthenticated = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'payload',
    getToken: getTokenFromHeaders,
});

module.exports = {
    isAuthenticated,
};