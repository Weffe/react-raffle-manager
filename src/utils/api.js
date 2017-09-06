import { client, privateRecord, usersList, raffleEntriesRecord } from './deepstream'
import { isEmpty, isObject } from 'lodash'
import moment from 'moment'

export function d(v) {
  return atob(v)
}

export function validateLogin(username, password) {
  let valid = null
  privateRecord.whenReady(record => {
    const data = record.get()
    valid = d(data.username) === username && d(data.password) === password
  })
  return valid
}

/**
 * Adds a new user to both the raffle/entries record and the users list for backup/replication purposes
 * @param {String} firstName 
 * @param {String} lastName 
 * @param {String} username 
 * @param {String} password 
 * @param {String} email 
 */
export function registerNewUser(firstName, lastName, username, password, email) {
  const guid = client.getUid()
  const newUserId = `users/${guid}`
  const lastUpdated = moment()
  let raffleEntries = null
  const newData = {
    guid,
    firstName,
    lastName,
    username,
    password,
    email,
    tickets: 1
  }

  // set new record inside users record
  client.record.getRecord(newUserId).set(newData)

  // add to usersList
  usersList.addEntry(newUserId)

  // add to raffle entries record
  raffleEntries = raffleEntriesRecord.get()
  if (isEmpty(raffleEntries) && isObject(raffleEntries)) raffleEntries = []
  raffleEntries.push({ ...newData, lastUpdated })
  raffleEntriesRecord.set(raffleEntries)
}

export function incrementRaffleTickets(username, password) {
  let successStatus = 'error'

  raffleEntriesRecord.whenReady(record => {
    const raffleEntries = record.get()
    let userID = null

    raffleEntries.forEach(entry => {
      if (entry.username === username && entry.password === password) {
        // check if the tickets has been updated in the last 6 hours
        const hourDifference = moment().diff(entry.lastUpdated, 'hours') // change back to hours instead of seconds!
        if (hourDifference > 6) {
          entry.tickets += 1
          entry.lastUpdated = moment()
          userID = `users/${entry.guid}`
          successStatus = 'success'
        } else {
          successStatus = 'warn'
        }
      }
    })

    if (successStatus === 'success') {
      // set raffle entries record
      record.set(raffleEntries)

      // set specific user info
      client.record.getRecord(userID).whenReady(record => {
        const data = record.get()
        data.tickets += 1
        record.set(data)
      })
    }
  })

  return successStatus
}