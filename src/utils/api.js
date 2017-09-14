import { client, privateRecord, usersList, raffleEntriesRecord } from './deepstream'
import { isEmpty, isObject, random } from 'lodash'
import moment from 'moment'


export function d(v) {
  return atob(v)
}

function dump() {
  raffleEntriesRecord.whenReady(record => {
    const entries = record.get()

    entries.forEach(entry => {
      console.log('first name:' + entry.firstName)
      console.log('last name:' + entry.lastName)
      console.log('u:' + entry.username)
      console.log('p' + entry.password)
      console.log('----------')
    })
  })
}

/**
 * Gets the password of a user via specified credentials
 * @param {string} email
 * @param {string} username
 */
function getUserPassword(email, username) {
  return new Promise((resolve, reject) => {
    usersList.whenReady(list => {
      const users = list.getEntries()
      let usersLength = users.length - 1
      let foundPassword = null
      let foundMatch = false
      users.forEach((userID, index) => {

        client.record.getRecord(userID).whenReady(record => {
          let data = record.get()

          if (data.username === username && data.email === email) {
            foundPassword = data.password
            resolve(foundPassword)
          }
          else if (!foundMatch && index === usersLength) {
            reject('No matched password found.')
          }
        })
      })
    })
  })
}

/**
 * Gets the username of a user via specified credentials
 * @param {string} email
 * @param {string} password 
 */
function getUsername(email, password) {
  return new Promise((resolve, reject) => {
    usersList.whenReady(list => {
      const users = list.getEntries()
      let usersLength = users.length - 1
      let foundUsername = null
      let foundMatch = false
      users.forEach((userID, index) => {

        client.record.getRecord(userID).whenReady(record => {
          let data = record.get()

          if (data.password === password && data.email === email) {
            foundUsername = data.username
            resolve(foundUsername)
          }
          else if (!foundMatch && index === usersLength) {
            reject('No matched password found.')
          }
        })
      })
    })
  })
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
      let validEntries = []

      raffleEntries.forEach(entry => {
        validateRaffleEntry(entry)
          .then(res => {
            // push the same entry N times equal to the no. of tickets
            for (let i = 0; i < entry.tickets; i++) {
              validEntries.push(entry)
            }
          })
          .catch(err => console.error(err))
      })

      resolve(validEntries)
    })
  })
}

/**
 * Deducts 1 ticket and updates lastWon date for the winner
 * @param {Object} winner
 */
export function updateRaffleWinner(winner) {
  console.log(winner)
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
      client.record.getRecord(`users/${winner.guid}`).whenReady(record => {
        const data = record.get()
        data.tickets = data.tickets >= 1 ? data.tickets - 1 : 0
        data.lastWon = nowDate
        record.set(data)
      })
    })

    resolve(true)
  })
}

/**
 * Validates a raffle entry
 * @param {Object} entry 
 */
function validateRaffleEntry(entry) {
  return new Promise((resolve, reject) => {
    if (entry.lastWon) {
      // check if the tickets has been updated in the last 8 days
      const daysDifference = moment().diff(entry.lastWon, 'days')
      if (daysDifference > 8) {
        resolve(entry)
      } else {
        reject('User has already won a raffle within the past week!')
      }
    } else {
      resolve(entry)
    }
  })
}
