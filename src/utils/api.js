import { client, privateRecord, usersList, raffleEntriesRecord } from './deepstream'
import { isEmpty, isObject, shuffle, random } from 'lodash'
import moment from 'moment'

export function d(v) {
  return atob(v)
}

export function validateAppLogin(username, password) {
  return new Promise((resolve, reject) => {
    let validStatus = null
    privateRecord.whenReady(record => {
      const data = record.get()
      validStatus = d(data.username) === username && d(data.password) === password
    })
    resolve(validStatus)
  })
}

export function validateAdminLogin(key) {
  return new Promise((resolve, reject) => {
    let validStatus = null
    privateRecord.whenReady(record => {
      const data = record.get()
      validStatus = d(data.key) === key
    })
    resolve(validStatus)
  })
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
  return new Promise((resolve, reject) => {
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
    resolve(true)
  })
}

export function incrementRaffleTickets(username, password) {
  return new Promise((resolve, reject) => {
    let successStatus = 'ERROR' // default error code

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
            successStatus = 'SUCCESS'
          } else {
            successStatus = 'WARN'
          }
        }
      })

      if (successStatus === 'SUCCESS') {
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

    resolve(successStatus)
  })
}

/**
 * @return {Object} - returns an object with randomizedEntries: Array & winner: Object
 */
export function getRaffleList() {
  return new Promise((resolve, reject) => {
    raffleEntriesRecord.whenReady(record => {
      const raffleEntries = record.get()
      let randomizedEntries = []

      raffleEntries.forEach(entry => {
        // push the same entry N times equal to the no. of tickets
        for (let i = 0; i < entry.tickets; i++) {
          randomizedEntries.push(entry)
        }
      })

      // finally shuffle all entries
      randomizedEntries = shuffle(randomizedEntries)

      // choose a random winner
      let winnerNotFound = true
      let randomIndex = random(randomizedEntries.length - 1)
      let winner = randomizedEntries[randomIndex]
      while (winnerNotFound) {
        const res = validateRaffleWinner(winner)

        if (res) {
          // we found a valid winner!
          winnerNotFound = false
        } else {
          // the user already won last week so lets remove them from the temporary entries list
          randomizedEntries.splice(randomIndex, 1)

          // check if the list is empty as an edge case
          if (isEmpty(randomizedEntries)) {
            reject('No potential winner found!')
            break
          }

          randomIndex = random(randomizedEntries.length - 1)
          winner = randomizedEntries[randomIndex]
        }
      }

      let result = { randomizedEntries, winner }
      resolve(result)
    })
  })
}

/**
 * Deducts 1 ticket and updates lastWon date for the winner
 * @param {Object} winner
 */
export function updateRaffleWinner(winner) {
  return new Promise((resolve, reject) => {
    raffleEntriesRecord.whenReady(record => {
      const raffleEntries = record.get()
      const nowDate = moment()

      raffleEntries.forEach(entry => {
        if (winner.guid === entry.guid) {
          entry.tickets = entry.tickets >= 1 ? entry.tickets - 1 : 0
          entry.lastWon = nowDate
        }
      })

      // set raffle entries record
      record.set(raffleEntries)

      // set specific user info
      client.record.getRecord(winner.guid).whenReady(record => {
        const data = record.get()
        data.tickets = data.tickets >= 1 ? data.tickets - 1 : 0
        data.lastWon = nowDate
        record.set(data)
      })
    })

    resolve(true)
  })
}

function validateRaffleWinner(winner) {
  if (winner.lastWon) {
    // check if the tickets has been updated in the last 8 days
    const daysDifference = moment().diff(winner.lastWon, 'days')
    if (daysDifference > 8) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}
