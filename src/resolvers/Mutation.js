const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutation = {
    async createUser(parent, arg, { prisma }, info) {
        const password = await bcrypt.hash(arg.data.password, 12);
        const user = {
            name: arg.data.name,
            email: arg.data.email,
            password
        };
        return prisma.mutation.createUser({data: user}, info);
    },
    deleteUser(parent, arg, { prisma }, info) {
        const userIndex = prisma.exists.User({id: arg.id});
        if (!userIndex) {
            throw Error('User not found');
        }
        return prisma.mutation.deleteUser({where: {id: arg.id}}, info);
    },
    async login(parent, arg, { prisma }, info) {
        const user = await prisma.query.user({where: {
            email: arg.data.email
        }})
        if (!user) {
            throw Error('Email or Password not matched');
        }
        const matched = await bcrypt.compare(arg.data.password, user.password);
        if (!matched) {
            throw Error('Email or Password not matched');
        }
        console.log(jwt.sign({ id: user.id }, process.env.SECRET_SECRET));
        return {
            name: user.name,
            token: jwt.sign({ id: user.id }, process.env.SECRET_SECRET)
        }
    },
    createPost(parent, arg, { prisma, pubsub }, info) {
        const userExisted = prisma.exists.User({id: arg.author});
        if (!userExisted) {
            throw Error('Author is not existing');
        }
        const post = {
            title: arg.title,
            content: arg.content,
            author: {
                connect: {
                    id: arg.author
                }
            },
            status: false
        }

        pubsub.publish('post', {post: { mutation: 'Created', data: post }});
        return prisma.mutation.createPost({data: post}, info);
    },
    async updatePost(parent, arg, { prisma, pubsub }, info) {
        const exist = await prisma.exists.Post({id: arg.data.id, author: {id: arg.data.author}});
        if (exist) {
            const data = {};
            if (arg.data.title) {
                data.title = arg.data.title;
            }
            if (arg.data.content) {
                data.content = arg.data.content;
            }
            if (arg.data.status !== undefined) {
                data.status = arg.data.status;
                if (!arg.data.status) {
                    await prisma.mutation.deleteManyComments({where: {post: {id: arg.data.id}}});
                }
            }
            // pubsub.publish('post', {post: { mutation: 'Updated', data }});
            return prisma.mutation.updatePost({where: {id: arg.data.id}, data}, info);
        }
        
        throw Error('This post not found or you can\'t edit this post');
    },
    async deletePost(parent, arg, { prisma }, info) {
        const exist = await prisma.exists.Post({id: arg.id});
        if (!exist) {
            throw Error('Post not found');
        }
        return prisma.mutation.deletePost({where: {id: arg.id}}, info);
    },
    async createComment(parent, arg, { prisma, pubsub }, info) {
        const userExisted = prisma.exists.User({id: arg.author});
        if (!userExisted) {
            throw Error('Author is not existing');
        } 
        const postExisted = await prisma.exists.Post({id: arg.post, status: true});
        if (!postExisted) {
            throw Error('Post is not existing');
        } 
        const comment = {
            content: arg.content,
            author: {
                connect: {
                    id: arg.author
                }
            },
            post: {
                connect: {
                    id: arg.post
                }
            },
        }

        return prisma.mutation.createComment({data: comment}, info);
    }
}

// export { Mutation as default };
module.exports = Mutation;
