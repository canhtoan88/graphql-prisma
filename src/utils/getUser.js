const jwt = require('jsonwebtoken');
module.exports = req => {
    const token = req.request ? req.request.headers.authorization : req.connection.context.Authorization;
    if (!token || token.length < 30) {
        throw 'Token invalid';
    }
    try {
        const decode = jwt.verify(token.replace('Bearer ', ''), 'mysecret');
        if (!decode || !decode.id) {
            throw 'Token invalid';
        }
        return decode.id;
    } catch (e) {
        throw Error(e);
    }
}