import React, { Component, useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'

type GoogleLoginProps = {
  name: string
}

type BlinkProps = {
  text: string
  isShowingText: boolean
}

const GoogleLogin: React.FC<GoogleLoginProps> = props => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: 'red' }}>{props.name} Google Button</Text>
    </View>
  )
}

class Blink extends Component {
  componentDidMount() {
    // Toggle the state every second
    setInterval(
      () =>
        this.setState(previousState => ({
          isShowingText: !previousState.isShowingText,
        })),
      1000
    )
  }

  //state object
  state = { isShowingText: true }

  render() {
    if (!this.state.isShowingText) {
      return null
    }

    return <Text>{this.props.text}</Text>
  }
}

export default class HelloWorldApp extends Component {
  render() {
    let pic = {
      uri:
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
    }
    return (
      <View style={{ alignItems: 'center', top: 200 }}>
        <Image
          source={require('@src/assets/images/clowd-logo.png')}
          style={{
            alignItems: 'center',
            width: 300,
            height: 300,
          }}
        />
        <GoogleLogin children="GoogleButtonUI" />
      </View>
    )
  }
}
