import React, { useEffect, useState } from 'react'
import { enableScreens } from 'react-native-screens'
import { AppProvider } from '@src/context/AppContext'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StartScreen from '@src/screen/StartScreen'
import FileBrowserStackScreen from '@src/screen/FileBrowserStackScreen'
import { NavigationContainer } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import * as SecureStore from 'expo-secure-store'

enableScreens()

SecureStore.deleteItemAsync('accessToken')
SecureStore.deleteItemAsync('refreshToken')

export type RootStackParamList = {
  FileBrowser: undefined
  Start: undefined
}

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>

export type RootStackParams = {
  navigation: RootStackNavigationProp
}

const RootStack = createNativeStackNavigator<RootStackParamList>()

function clearTokens() {
  SecureStore.deleteItemAsync('accessToken')
  SecureStore.deleteItemAsync('refreshToken')
}

const App: React.FC = () => {
  // clearTokens()

  // Check the tokens and load sign in screen if it's not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <AppProvider>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            stackPresentation: 'transparentModal',
            headerShown: false,
          }}
        >
          <RootStack.Screen
            name="FileBrowser"
            component={FileBrowserStackScreen}
          />
          <RootStack.Screen name="Start" component={StartScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </AppProvider>
  )
}

export default App
