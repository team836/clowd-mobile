import React from 'react'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FileBrowserScreen from './src/screen/FileBrowserScreen'
import { enableScreens } from 'react-native-screens'
import { View, Text } from 'react-native'

enableScreens()

export type RootStackParamList = {
  FileBrowser: { folderName: string; files?: Array<any> } | undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App: React.FC = () => {
  return (
    <NavigationNativeContainer>
      <View
        style={{
          height: 100
        }}
      >
        <Text>Hello World</Text>
      </View>
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
  )
}

export default App
