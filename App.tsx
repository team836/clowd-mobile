import React from 'react'
import { enableScreens } from 'react-native-screens'
import { AppProvider } from '@src/context/AppContext'
import MainScaffold from '@src/component/MainScaffold'
import * as Google from 'expo-google-app-auth'
import StartScreen from '@src/screen/StartScreen'

enableScreens()

const App: React.FC = () => {
  async function auth() {
    const googleLoginResult = await Google.logInAsync({
      iosClientId: ``,
    })

    if (googleLoginResult.type === 'success') {
      console.log(googleLoginResult.user)
    }
  }

  return (
    <AppProvider>
      {/*<MainScaffold />*/}
      <StartScreen />
    </AppProvider>
  )
}

export default App
