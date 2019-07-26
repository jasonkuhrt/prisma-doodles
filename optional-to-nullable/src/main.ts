import Photon from "@generated/photon"

async function main(photon: Photon) {
  photon.users.create({ data: {} })
  const users = await photon.users.findMany({})
  console.log(`==> users: `, users)
  // ==> users:  [
  //   { id: 'cjyjek7id0000y7xy2hb3s17c', preferred_ice_cream: null },
  // ]
}

const photon = new Photon()
main(photon)
  .catch(console.error)
  .finally(async () => {
    await photon.disconnect()
  })
