const jwt = require('jsonwebtoken');
const User = {
    posts: {
        fragment: 'fragment id on User { id }',
        resolve(parent, arg, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    status: true,
                    author: {
                        id: parent.id
                    }
                }
            })
        }
    },
    email: {
        fragment: 'fragment id on User { id }',
        resolve(parent, arg, { req }, info) {
            const token = req.request.headers.authorization;
            try {
                const decode = jwt.verify(token, process.env.SECRET_SECRET);
                if (!decode || !decode.id) {
                    throw Error('Token is invalid');
                }
                return parent.id === decode.id ? parent.email : null;
            } catch (e) {
                throw Error(e);
            }
        }
    }
}

// export { User as default };
module.exports = User;