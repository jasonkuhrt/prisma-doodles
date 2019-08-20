import * as path from "path"
import * as types from "./types"
import { makeSchema } from "nexus"
// TODO Release new version of nexus that compiles
// import { ApolloServer } from "apollo-server"
// import * as context from "./context"

const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(__dirname, "./nexus.d.ts"),
    schema: path.join(__dirname, "../schema.graphql"),
  },
})

console.log(schema)

// const server = new ApolloServer({
//   schema: schema,
//   context: context.create(),
// })

// server.listen({ port: 4000 }).then(() => {
//   console.log("listening on port 4000")
// })
