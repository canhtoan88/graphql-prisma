const getUser = require('../utils/getUser');

const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;

            // setInterval(() => {
            //     count++;
            //     pubsub.publish('count', {
            //         count
            //     });
            // }, 1000);

            return pubsub.asyncIterator('count');
        }
    },
    comment: {
        subscribe(parent, { postId }, { prisma }, info) {
            return prisma.subscription.comment({
                where: {
                    node: {
                        post: {
                            id: postId
                        }
                    }
                }
            }, info);
        }
    },
    post: {
        subscribe(parent, arg, { prisma }, info) {
            return prisma.subscription.post({
                where: {
                    node: {
                        status: false
                    }
                }
            }, info);
        }
    },
    myPosts: {
        subscribe(parent, arg, { prisma, req }, info) {
            const id = getUser(req);
            return prisma.subscription.post({where: { node: { author: {id} }}}, info);
        }
    }
}

// export { Subscription as default };
module.exports = Subscription;