const { GraphQLServer, PubSub } = require('graphql-yoga');
const db          = require('./db');
const prisma      = require('./prisma');
const {resolvers, fragmentReplacements} = require('./resolvers');
// import Query from './resolvers/Query';
// import Mutation from './resolvers/Mutation';
// import Subscription from './resolvers/Subscription';
// import Person from './resolvers/Person';
// import Post from './resolvers/Post';
// import Comment from './resolvers/Comment';
// import db from './db';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => {
        // console.log(req.request.headers.authorization);
        return {
            db,
            pubsub,
            prisma,
            req
        }
    },
    fragmentReplacements
});

server.start({port: process.env.PORT || 4000}, () => {
    console.log('Server was started...');
})