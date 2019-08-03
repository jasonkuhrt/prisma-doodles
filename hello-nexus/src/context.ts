import * as m from "./models"

interface DB {
  users: Index<m.User>
}

const db: DB = {
  users: {
    1: { firstName: "joe", superSecret: "hush" },
    2: { firstName: "kim", superSecret: "whisper" },
  },
}

export interface Context {
  db: DB
}

export const create = (): Context => {
  return { db }
}
