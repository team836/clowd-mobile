import React from 'react'
import { enableScreens } from 'react-native-screens'
import { AppProvider } from '@src/context/AppContext'
import MainScaffold from '@src/component/MainScaffold'
import * as Google from 'expo-google-app-auth'

enableScreens()

const App: React.FC = () => {
  async function auth() {
    const googleLoginResult = await Google.logInAsync({
      iosClientId: ``
    })

    if (googleLoginResult.type === 'success') {
      console.log(googleLoginResult.user)
    }
  }

  return (
    <AppProvider>
      <MainScaffold />
    </AppProvider>
  )
}

export default App
