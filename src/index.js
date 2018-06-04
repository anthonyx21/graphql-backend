const { GraphQLServer } = require('graphql-yoga')
const _ = require('lodash')
const { Prisma } = require('prisma-binding')

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }]

let idCount = links.length
// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info)
    },
    link: (root, {id}) => {
      return context.db.query.links({id:id}, info)
    },
  },
  Link: {
    id: (root) => root.id,
    description: (root) => root.description,
    url: (root) => root.url,
  },
  Mutation: {
    // 2
    post: (root, args) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info)
    },
    deleteLink: (root, args) => {
      return context.db.mutation.deleteLink({
        where: {
          id: args.id
        },
      }, info)
    },
    deleteLink: (root, {id}) => _.remove(links, link=> link.id === id)[0]
  },
}

// 3
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466/hackernews-node/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  })
})
server.start(() => console.log(`Server is running on http://localhost:4000`))