import React, { Component, useContext } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { AppContext } from '@src/context/AppContext'
import * as WebBrowser from 'expo-web-browser'
import { Linking } from 'expo'
import * as SecureStore from 'expo-secure-store'
import { RootStackParams, RootStackNavigationProp } from '@root/App'

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
    justifyContent: 'center',
  },

  clowdLogoImage: {
    height: '50%',
    width: '70%',
    alignItems: 'center',
  },

  buttonLayout: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },

  button: {
    position: 'relative',
    width: '100%',
    height: '55%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
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
    width: 25,
    height: 25,
    marginRight: 5,
  },

  buttonGoogleLogoText: {
    fontSize: 17,
    fontWeight: '400',
    //fontWeight: 'bold',
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

type LogInButtonProps = {
  navigation: RootStackNavigationProp
}
const LogInButton: React.FC<LogInButtonProps> = ({ navigation }) => {
  const appContext = useContext(AppContext)

  return (
    <View style={styles.buttonLayout}>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          const deepLink = Linking.makeUrl()
          try {
            const result = await WebBrowser.openBrowserAsync(
              // 'https://dev.api.clowd.xyz/v1/auth/login'
              'https://dev.api.clowd.xyz/v1/auth/clowdee/login'
            )
          } catch (error) {
            console.error(error)
          }
          // navigation.popToTop()
        }}
        activeOpacity={0.7}
      >
        <View style={styles.buttonGoogleLogo_TextLayout}>
          <Image
            resizeMethod="scale"
            resizeMode="contain"
            style={styles.buttonGoogleLogoImage}
            source={require('@src/assets/images/Google-logo.png')}
          />
          <Text style={styles.buttonGoogleLogoText}> Sign in with Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const StartScreen: React.FC<RootStackParams> = ({ navigation }) => {
  Linking.addEventListener('url', async e => {
    const url = e.url
    let { path, queryParams } = Linking.parse(url)
    const { accessToken, refreshToken } = queryParams
    console.log(`accessToken: ${accessToken}`)
    console.log(`refreshToken: ${refreshToken}`)
    WebBrowser.dismissBrowser()
    if (!accessToken || !refreshToken) {
      console.log('wrong tokens')
      Alert.alert('Sign Up Fails')
    } else {
      await SecureStore.setItemAsync('accessToken', accessToken)
      await SecureStore.setItemAsync('refreshToken', refreshToken)
      navigation.popToTop()
    }
  })

  return (
    <View style={styles.mainLayout}>
      <StatusBar hidden={true} />
      <ClowdLogo />
      <LogInButton navigation={navigation} />
    </View>
  )
}

export default StartScreen
