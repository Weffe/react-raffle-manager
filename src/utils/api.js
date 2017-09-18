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
            reject('Password does not match.')
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

export function resetUsername(email, password, newUsername) {
  return new Promise((resolve, reject) => {
    usersList.whenReady(list => {
      const users = list.getEntries()
      let usersLength = users.length - 1
      let foundMatch = false
      users.forEach((userID, index) => {

        client.record.getRecord(userID).whenReady(record => {
          let data = record.get()

          if (data.password === password && data.email === email) {
            foundMatch = true
            record.set('username', newUsername)
            resolve('Reset username!')
          }
          else if (!foundMatch && index === usersLength) {
            reject('Password is not valid.')
          }
        })
      })
    })
  })
}

export function resetUserPassword(email, username, newPassword) {
  return new Promise((resolve, reject) => {
    usersList.whenReady(list => {
      const users = list.getEntries()
      let usersLength = users.length - 1
      let foundMatch = false
      users.forEach((userID, index) => {

        client.record.getRecord(userID).whenReady(record => {
          let data = record.get()

          if (data.username === username && data.email === email) {
            foundMatch = true
            record.set('password', newPassword)
            resolve('Reset password!')
          }
          else if (!foundMatch && index === usersLength) {
            reject('Username is not valid.')
          }
        })
      })
    })
  })
}

export function validateAppLogin(username, password) {
  return new Promise((resolve, reject) => {
    privateRecord.whenReady(record => {
      const data = record.get()
      if (d(data.username) === username && d(data.password) === password)
        resolve('Valid credentials.')
      else
        reject('Credentials do not match.')
    })
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

    const userData = {
      guid,
      firstName,
      lastName,
      username,
      password,
      email
    }

    const raffleEntryData = {
      guid,
      firstName,
      lastName,
      lastUpdated,
      tickets: 1
    }

    // set new record inside users record
    client.record.getRecord(newUserId).set(userData)

    // add to usersList
    usersList.addEntry(newUserId)

    // add to raffle entries record
    raffleEntriesRecord.whenReady((record) => {
      let raffleEntries = record.get()

      // catching edge case error for starting with an empty object
      if (isEmpty(raffleEntries) && isObject(raffleEntries)) raffleEntries = []

      raffleEntries.push(raffleEntryData)
      record.set(raffleEntries)
      resolve('Registered new user.')
    })
  })
}

/** Increments ticket count for a specified entry
 * @param {string} username
 * @param {string} password
 * @return {Object} - {type: 'MSG_TYPE', payload: 'msg'}
 */
export function incrementRaffleTickets(username, password) {
  return new Promise((resolve, reject) => {
    usersList.whenReady((list) => {
      const users = list.getEntries()
      let usersLength = users.length - 1
      let foundMatch = false
      users.forEach((userID, index) => {

        client.record.getRecord(userID).whenReady(record => {
          let data = record.get()

          // matched user
          if (data.username === username && data.password === password) {
            foundMatch = true

            raffleEntriesRecord.whenReady((record) => {
              const raffleEntries = record.get()

              raffleEntries.forEach(entry => {
                if (entry.guid === data.guid) {
                  // check if the tickets has been updated in the last 6 hours
                  const hourDifference = moment().diff(entry.lastUpdated, 'seconds') // change back to hours instead of seconds!
                  if (hourDifference > 6) {
                    entry.tickets += 1
                    entry.lastUpdated = moment()
                    record.set(raffleEntries)
                    resolve({ type: 'SUCCESS', payload: 'Successfully added a raffle ticket!' })
                  } else {
                    resolve({ type: 'WARN', payload: 'Already added your weekly ticket!' })
                  }
                }
              })
            })
          }
          else if (!foundMatch && index === usersLength) {
            reject('Username or Password was incorrect!')
          }
        })
      })
    })
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
            for (let i = 0; i < res.tickets; i++) {
              validEntries.push(res)
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
