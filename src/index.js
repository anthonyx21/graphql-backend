const { GraphQLServer } = require('graphql-yoga')
const _ = require('lodash')
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
    feed: () => links,
    link: (root, {id}) => _.find(links, link=> link.id === id)
  },
  Link: {
    id: (root) => root.id,
    description: (root) => root.description,
    url: (root) => root.url,
  },
  Mutation: {
    // 2
    post: (root, args) => {
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    deleteLink: (root, {id}) => _.remove(links, link=> link.id === id)[0]
  },
}

// 3
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))