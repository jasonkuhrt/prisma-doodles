import * as path from "path"
import { makeSchema, objectType, idArg } from "nexus"
import { ApolloServer } from "apollo-server"
import * as context from "./context"

const query = objectType({
  name: "Query",
  definition(t) {
    t.string("name", {
      resolve() {
        return "joe"
      },
    })
    t.field("user", {
      type: "User",
      nullable: true,
      args: {
        id: idArg({ nullable: false }),
      },
      resolve(_root, args, ctx) {
        return ctx.db.users[args.id] || null
      },
    })
  },
})

const user = objectType({
  name: "User",
  definition(t) {
    t.string("firstName")
  },
})

const schema = makeSchema({
  types: [query, user],
  outputs: {
    schema: path.join(__dirname, "../schema.graphql"),
    typegen: path.join(__dirname, "../nexus.d.ts"),
  },
  typegenAutoConfig: {
    sources: [
      { source: path.join(__dirname, "./models.ts"), alias: "models" },
      {
        source: path.join(__dirname, "./context.ts"),
        alias: "context",
      },
    ],
    contextType: "context.Context",
  },
})

const server = new ApolloServer({ schema, context: context.create() })

server.listen({ port: 4000 }).then(() => {
  console.log("listening on port 4000")
})
