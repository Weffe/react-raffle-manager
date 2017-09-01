import { client, privateRecord, raffleList } from './deepstream'

export const d = v => atob(v)

export const validateLogin = (username, password) => {
  let valid = null
  privateRecord.whenReady(record => {
    const data = record.get()
    valid = d(data.username) === username && d(data.password) === password
  })
  return valid
}

export const registerNewUser = (firstName, lastName, username, password, email) => {
  const newUserId = `users/${client.getUid()}`

  client.record.getRecord(newUserId).set({
    firstName,
    lastName,
    username,
    password,
    email,
    tickets: 1
  })

  raffleList.addEntry(newUserId)
}
