import deepstream from 'deepstream.io-client-js'
import { d } from './api'

export const client = deepstream('wss://013.deepstreamhub.com?apiKey=c8ee9a23-71d7-4025-bd83-dc646006683c').login({
  type: 'email',
  email: d('cm9nZWxpb19uZWdyZXRlQGxpdmUuY29t'),
  password: d('bXVzaWM0bGlmZQ==')
})

export const usersList = client.record.getList('users')
export const raffleEntriesRecord = client.record.getRecord('raffle/entries')
export const privateRecord = client.record.getRecord('private/info')
