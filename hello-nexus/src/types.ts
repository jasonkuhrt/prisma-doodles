import { queryType, queryField, objectType, idArg } from "nexus"

export const query = objectType({
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

export const queryMoods = queryField("moods", {
  list: true,
  type: "String",
  resolve: () => ["happy", "sad"],
})

export const user = objectType({
  name: "User",
  definition(t) {
    t.string("firstName")
  },
})
