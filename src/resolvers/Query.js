const jwt = require('jsonwebtoken');
const getUser = require('../utils/getUser');
// Scalar types: ID, String, Int, Boolean, Float
const Query = {
    hello(parent, arg, { db }, info) {
        return `Hello ${arg.name}, you are ${arg.age} years old.`;
    },
    add(parent, arg, { db }, info) {
        return arg.arr.reduce((total, value) => total + value, 0);
    },
    users(parent, arg, { prisma }, info) {
        // prisma.query.users(null, info).then(users => console.log(users))
        return prisma.query.users(null, info);
    },
    posts(parent, arg, { prisma, req }, info) {
        getUser(req);
        if (arg.status !== undefined) {
            return prisma.query.posts({status: arg.status}, info);
        }
        return prisma.query.posts(null, info);
    },
    comments(parent, arg, { prisma }, info) {
        return prisma.query.comments({first: arg.first, skip: arg.skip, after: arg.after}, info);
    }
}

// export { Query as default };
module.exports = Query;