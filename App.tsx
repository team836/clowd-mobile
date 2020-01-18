import React, { useState } from 'react'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FileBrowserScreen from './src/screen/FileBrowserScreen'
import { enableScreens } from 'react-native-screens'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { NavigationProvider } from '@src/context/NavigationContext'

enableScreens()

export type RootStackParamList = {
  FileBrowser: { folderName: string; files?: Array<any> } | undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App: React.FC = () => {
  const [statusBarHeight, setStatusBarHeight] = useState(
    getStatusBarHeight() + 60
  )

  return (
    <NavigationProvider>
      <NavigationNativeContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerLargeTitle: true,
            contentStyle: {
              backgroundColor: '#fff'
            }
          }}
        >
          <Stack.Screen
            name="FileBrowser"
            component={FileBrowserScreen}
            options={({ route }) => ({
              title:
                route.params && route.params.folderName
                  ? route.params.folderName
                  : 'Clowd'
            })}
          />
        </Stack.Navigator>
      </NavigationNativeContainer>
    </NavigationProvider>
  )
}

export default App
