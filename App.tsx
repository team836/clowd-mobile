import React, { useState } from 'react'
import { View, Image } from 'react-native'
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
      <View
        style={{
          backgroundColor: '#fff',
          width: 65,
          height: 65,
          position: 'absolute',
          right: 30,
          bottom: 30,
          borderRadius: 50,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: {
            width: 0,
            height: 10
          },
          shadowRadius: 30,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image
          source={require('@src/assets/images/plus.png')}
          style={{
            width: 25,
            height: 25
          }}
        />
      </View>
    </NavigationNativeContainer>
  )
}

export default App
