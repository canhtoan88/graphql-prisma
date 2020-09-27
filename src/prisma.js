const { Prisma } = require('prisma-binding');
const {fragmentReplacements} = require('./resolvers');

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'thisismysecretary',
    fragmentReplacements
});

module.exports = prisma;

// prisma.query
// prisma.mutation
// prisma.subscriptionb
// prisma.exists

// prisma.query.posts(null, '{ id title author { id name } }')
// .then(data => {
//     console.log(data[0].id);
// })

// prisma.query.users(null, ' { id name email } ')
// .then(users => {
//     console.log(JSON.stringify(users, ['id', 'name'], 2));
// })

// prisma.mutation.createUser({
//     data: {
//         name: 'Nguyen cute',
//         email: 'phuongnguyencute02@gmail.com'
//     }
// }, '{ id name email }')
// .then(user => console.log(user));

// prisma.mutation.createPost({
//     data: {
//         title: 'This a first post',
//         content: 'This is a content',
//         status: true,
//         author: {
//             connect: {
//                 id: 'ckfb3ok0r004k0749mastdk48'
//             }
//         }
//     }
// }, ' { id title content author { name } } ')
// .then(post => console.log(post));

// prisma.mutation.updatePost({
//     where: {
//         id: 'ckfb9p211005i0749iss0rmsx'
//     },
//     data: {
//         title: 'Edited title at now'
//     }
// }, '{ id title status }')
// .then(post => console.log(post))

// prisma.mutation.createComment({
//     data: {
//         content: 'Nguyen was commented in here',
//         author: {
//             connect: {
//                 id: 'ckfb93ubm00530749qvw88w4h'
//             }
//         },
//         post: {
//             connect: {
//                 id: 'ckfb9p211005i0749iss0rmsx'
//             }
//         }
//     }
// }, '{ id content author { id name email } }')
// .then(comment => console.log(comment))

/*const updateManyComments = async (where, data, expectValue) => {
    try {
        const updatedComemnts = await prisma.mutation.updateManyComments({ where, data }, expectValue);
        console.log(JSON.stringify(updatedComemnts, null, 2));
    } catch (error) {
        console.log(error);
    }
}

const queryPost = async (where, expectValuePost, expectValueComment) => {
    try {
        const post = await prisma.query.post({ where }, expectValuePost)
        const comments = await prisma.query.comments(null, expectValueComment);
            post.comments = comments;
            console.log(JSON.stringify(post, null, 2));
    } catch(error) {
        console.log(error);
    }
}
updateManyComments({ post: { id: 'ckfb9p211005i0749iss0rmsx' } }, { content: 'this is Content has be edited by admin' }, '{ count }');
queryPost({ id: 'ckfb9p211005i0749iss0rmsx' }, '{ title }', '{ content author { name } }');*/

// const checkExist = async (where) => {
//     const existed = await prisma.exists.Comment(where);
//     console.log(existed);
// }
// checkExist({id: 'ckfam0gep003u07492qimwrw1'});