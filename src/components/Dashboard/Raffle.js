import React, { Component } from 'react'
import { Grid, Button, Header, Dimmer, Transition } from 'semantic-ui-react'
import { getRaffleList, updateRaffleWinner } from '../../utils/api'
import { random, upperFirst, shuffle } from 'lodash'
import { toast } from 'react-toastify'
import mojs from 'mo-js'
import './custom.css'

const burstOneFactory = () =>
  new mojs.Burst({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    radius: { 4: 32 },
    angle: 45,
    count: 14,
    children: {
      radius: 2.5,
      fill: [
        { '#9EC9F5': '#9ED8C6' },
        { '#91D3F7': '#9AE4CF' },

        { '#DC93CF': '#E3D36B' },
        { '#CF8EEF': '#CBEB98' },

        { '#87E9C6': '#1FCC93' },
        { '#A7ECD0': '#9AE4CF' },

        { '#87E9C6': '#A635D9' },
        { '#D58EB3': '#E0B6F5' },

        { '#F48BA2': '#CF8EEF' },
        { '#91D3F7': '#A635D9' },

        { '#CF8EEF': '#CBEB98' },
        { '#87E9C6': '#A635D9' }
      ],
      scale: { 1: 0, easing: 'quad.in' },
      pathScale: [0.8, null],
      degreeShift: [13, null],
      duration: 700,
      easing: 'quint.out'
      // speed: .1
    }
  })

const burstTwoFactory = () =>
  new mojs.Burst({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    radius: { 0: 100 },
    count: 10,
    children: {
      shape: 'polygon',
      points: 7,
      fill: { cyan: 'yellow' },
      angle: { 360: 0 },
      duration: 1000,
      delay: 'stagger( rand(0, 100) )'
    }
  })

const burstThreeFactory = () =>
  new mojs.Burst({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    radius: { 4: 32 },
    angle: 45,
    count: 14,
    children: {
      radius: 2.5,
      fill: '#FD7932',
      scale: { 1: 0, easing: 'quad.in' },
      pathScale: [0.8, null],
      degreeShift: [13, null],
      duration: [500, 700],
      easing: 'quint.out'
    }
  })

const burstFourFactory = () =>
  new mojs.Burst({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    children: {
      duration: 750
    }
  })

// setting up our fireworks
const fireworks = []

for (let i = 0; i < 4; i++) {
  fireworks.push(burstOneFactory())
  fireworks.push(burstTwoFactory())
  fireworks.push(burstThreeFactory())
  fireworks.push(burstFourFactory())
}

export default class Dashboard extends Component {
  state = { dimmerActive: false, raffleStatus: 'IDLE', entryName: null, transitionDuration: 70, transitionVisible: true }

  handleDimmerOpen = () => {
    this.setState({ dimmerActive: true })

    this.chooseRaffleWinner()
  }

  chooseRaffleWinner = () => {
    const computedName = entry => `${upperFirst(entry.firstName)} ${upperFirst(entry.lastName)}`

    const { transitionDuration } = this.state
    getRaffleList()
      .then(validEntries => {
        let shuffledEntries = shuffle(validEntries)
        let randomIndex = random(shuffledEntries.length - 1)
        let numEntriesToTransition = shuffledEntries.length // transition the entire list
        this.setState({ raffleStatus: 'CHOOSING' })

        const intervalID = setInterval(() => {
          randomIndex = random(shuffledEntries.length - 1)
          let randomEntry = shuffledEntries[randomIndex]

          let randomEntryName = computedName(randomEntry)

          this.setState(state => ({ transitionVisible: !state.transitionVisible }))
          this.setState(state => ({ transitionVisible: !state.transitionVisible, entryName: randomEntryName }))
        }, transitionDuration)

        setTimeout(() => {
          clearInterval(intervalID)

          randomIndex = random(shuffledEntries.length - 1)
          let winner = shuffledEntries[randomIndex]

          let winnerName = computedName(winner)

          // update the winner's tickets and lastWon via api
          updateRaffleWinner(winner)

          this.setState({ entryName: winnerName, raffleStatus: 'COMPLETED' }, () => {
            // start mo.js
            fireworks.forEach(burst => {
              let coords = { x: random(250, document.body.clientWidth - 250), y: random(250, document.body.clientHeight - 250) }
              burst.tune(coords).replay()
            })

            this.mojsIntervalID = setInterval(() => {
              fireworks.forEach(burst => {
                let coords = {
                  x: 0,
                  y: 0,
                  left: random(document.body.clientWidth),
                  top: random(document.body.clientHeight)
                }
                burst.tune(coords).replay()
              })
            }, 1500)
          })
        }, transitionDuration * numEntriesToTransition)
      })
      .catch(err => {
        console.error(err)
        toast.error('There was an issue selecting a valid winner!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        })
        this.setState({ dimmerActive: false })
      })
  }

  handleDimmerClose = () => {
    const { raffleStatus } = this.state
    if (!(raffleStatus === 'CHOOSING')) {
      this.setState({ dimmerActive: false, entryName: null, raffleStatus: 'IDLE' })
      clearInterval(this.mojsIntervalID)
    }
  }

  render() {
    const { dimmerActive, entryName, transitionVisible, transitionDuration, raffleStatus } = this.state
    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as="h1">Raffle</Header>
            <Button color="teal" size="big" onClick={this.handleDimmerOpen}>
              Pick a random winner!
            </Button>

            <Dimmer active={dimmerActive} page>
              <Grid ref={node => (this.dimmerNode = node)}>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Transition visible={raffleStatus === 'COMPLETED'} animation="pulse" duration={300} transitionOnMount>
                      <Header as="h1" style={{ fontSize: '3.5rem', color: 'white' }}>
                        Winner!
                      </Header>
                    </Transition>
                    <Transition visible={transitionVisible} animation="scale" duration={transitionDuration} transitionOnMount>
                      <Header color="yellow" as="h1" style={{ fontSize: '5rem' }}>
                        {entryName}
                      </Header>
                    </Transition>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Button onClick={this.handleDimmerClose}>Close Raffle</Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Dimmer>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
