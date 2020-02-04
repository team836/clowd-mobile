import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native'

const styles = StyleSheet.create({
  mainLayout: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
    flexDirection: 'column',
  },

  clowdLogoLayout: {
    flex: 5,
    padding: 10,
    backgroundColor: 'black',
    alignItems: 'center',
  },

  clowdLogoImage: {
    height: '100%',
    width: '120%',
    alignItems: 'center',
  },

  buttonLayout: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },

  button: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonGoogleLogo_TextLayout: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonGoogleLogoImage: {
    width: 50,
    height: 50,
  },

  buttonGoogleLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})

function ClowdLogo() {
  return (
    <View style={styles.clowdLogoLayout}>
      <Image
        style={styles.clowdLogoImage}
        source={require('@src/assets/images/clowd-logo.png')}
      />
    </View>
  )
}

function LogInButton() {
  return (
    <View style={styles.buttonLayout}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('send API')}
      >
        <View style={styles.buttonGoogleLogo_TextLayout}>
          <Image
            resizeMethod="scale"
            resizeMode="contain"
            style={styles.buttonGoogleLogoImage}
            source={require('@src/assets/images/Google-logo.png')}
          />
          <Text style={styles.buttonGoogleLogoText}>Sign in with Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default class mainLayout extends Component {
  render() {
    return (
      <View style={styles.mainLayout}>
        <ClowdLogo />
        <LogInButton />
      </View>
    )
  }
}
